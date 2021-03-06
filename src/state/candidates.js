import uniqBy from 'lodash/uniqBy';
import { produce } from 'immer';
import cf from '../config';
import history from '../history';
import * as ms from '../config/messages';
import execEffect from '../libs/execEffect';
import uploadToIpfs from '../libs/ipfsLib';
import {
      getCandidateInfo,
      getTotalVotesFor,
      addCandidateInfo,
      addVoteFor
} from '../services/CandidatesContract';

export default {
      name: 'candidates',
      state: cf.candidates.map(e => ({ name: e, vote: '0', info: [] })),

      selectors: {
            getInfoFor: () => ({ candidates }) => candidate => {
                  const item = candidates.find(e => e.name === candidate);
                  return item ? item.info : [];
            }
      },

      reducers: {
            updateList(state, data) {
                  return state.map(e => {
                        const src = data.find(k => k.name === e.name);
                        return Object.assign({}, e, src);
                  });
            },

            updateInfo: (state, { name, info }) =>
                  produce(state, draft => {
                        const i = draft.findIndex(e => e.name === name);
                        draft[i].info = info;
                  })
      },

      effects: dispatch => ({
            async fetchInfo(name) {
                  execEffect(dispatch)(
                        async () => {
                              const info = await getCandidateInfo(name);
                              this.updateInfo({ name, info });
                        },
                        () => dispatch.alert.error(ms.retrieveDataFailure)
                  );
            },

            async addInfo(
                  payload,
                  {
                        user: { address }
                  }
            ) {
                  execEffect(dispatch)(
                        async () => {
                              let attachmentHash = null;
                              const { file, ...rest } = payload;
                              if (file) {
                                    attachmentHash = await uploadToIpfs(file);
                              }
                              await addCandidateInfo(
                                    { ...rest, attachmentHash },
                                    address
                              );
                              history.push(cf.routes.voting);
                        },
                        () => dispatch.alert.error(ms.notSaved)
                  );
            },

            async fetchVotes(_, { candidates }) {
                  execEffect(dispatch)(
                        async () => {
                              const updated = [];
                              await Promise.all(
                                    candidates.map(async ({ name }) => {
                                          const vote = await getTotalVotesFor(
                                                name
                                          );
                                          updated.push({ name, vote });
                                    })
                              );
                              this.updateList(updated);
                        },
                        () => dispatch.alert.error(ms.retrieveDataFailure)
                  );
            },

            async addVote(
                  candidate,
                  {
                        candidates,
                        user: { address }
                  }
            ) {
                  execEffect(dispatch)(
                        async () => {
                              const updated = [...candidates];
                              await addVoteFor(candidate, address);
                              await dispatch.user.addVoteToRecord(candidate);
                              const vote = await getTotalVotesFor(candidate);
                              updated.unshift({ name: candidate, vote });
                              this.updateList(uniqBy(updated, 'name'));
                        },
                        () => dispatch.alert.error(ms.notEnoughFunds)
                  );
            }
      })
};

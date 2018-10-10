import cf from '../config';
import uniqBy from 'lodash/uniqBy';
import history from '../history';
import * as ms from '../config/messages';
import {produce} from 'immer';
import {execEffect} from '../libs/execEffect';
import {uploadToIpfs} from '../libs/ipfsLib';
import {getTotalVotesFor, voteForCandidate} from '../services/VotingContract';
import {addCandidateInfo, getCandidateInfo} from '../services/CandidateContract';

export default {
      name: 'candidates',
      state: cf.candidates.map(e => ({ name: e, vote: '0', info: [] })),

      selectors: {

            getInfoFor: () => ({ candidates }) => candidate => {
                  const e = candidates.find(e => e.name === candidate);
                  return e ? e.info : [];
            }
      },

      reducers: {

            updateList( state, data ) {
                  return state.map( e => {
                        const src = data.find(k => k.name === e.name);
                        return Object.assign({}, e, src);
                  });
            },

            updateInfo: (state, { name, info }) => {
                  return produce(state, draft => {
                        const i = draft.findIndex(e => e.name === name);
                        draft[i].info = draft[i].info.concat(info);
                  });
            }
      },

      effects: dispatch => ({

            async fetchInfo (name) {
                  execEffect(dispatch)(async () => {
                        const info = await getCandidateInfo(name);
                        this.updateInfo({ name, info });
                  }, () => dispatch.alert.error(ms.retrieveDataFailure));
            },

            async addInfo (payload, { user: { address }}) {
                  execEffect(dispatch)(async () => {
                        let fileHash = null;
                        const {file, ...rest} = payload;
                        if (file) fileHash = await uploadToIpfs(file);
                        await addCandidateInfo({ ...rest, fileHash }, address);
                        history.push(cf.routes.voting);
                  }, () => dispatch.alert.error(ms.notSaved));
            },

            async fetchVotes (_, {candidates}) {
                  execEffect(dispatch)(async () => {
                        const updated = [];
                        await Promise.all(candidates.map(async ({name}) => {
                              const vote = await getTotalVotesFor(name);
                              updated.push({name, vote });
                        }));
                        this.updateList(updated);
                  }, () => dispatch.alert.error(ms.retrieveDataFailure));
            },

            async addVote (candidate, {candidates, user: {name, address}}) {
                  execEffect(dispatch)(async () => {
                        let updated = [...candidates];
                        await voteForCandidate(candidate, name, address);
                        const vote = await getTotalVotesFor(candidate);
                        updated.unshift({ name: candidate, vote: vote });
                        this.updateList(uniqBy(updated, 'name'));
                  }, () => dispatch.alert.error(ms.notEnoughFunds));
            }
      })
}
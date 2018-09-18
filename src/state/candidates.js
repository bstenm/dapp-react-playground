import ms from '../config/messages';
import cf from '../config';
import Log from '../services/Log';
import web3 from '../services/Web3';
import uniqBy from 'lodash/uniqBy';
import ipfsApi from 'ipfs-api';
import {dispatch} from '@rematch/core';
import Contracts from '../services/ContractsInstances';

export default {
      state: cf.candidates.map(e => ({name: e, vote: '0'})),
      reducers: {
            updateList( state, payload ) {
                  return payload;
            }
      },
      effects: {
            async addInfo (payload, { user: { address }}) {
                  try {
                        let res;
                        dispatch.loading.start();
                        const from = address;
                        const { candidate, description, file } = payload;
                        var reader = new FileReader();
                        reader.readAsArrayBuffer(file);
                        reader.onloadend = () => {
                              const buffer = Buffer(reader.result);
                              console.log('BUFFER >>', typeof buffer);
                              if (file) ipfsApi().files.add(buffer, (err, files) => {
                                    if (! err) return console.log('IPFS SUCCESS:', files);
                                    Log.error(err);
                                    if (err) dispatch.alert.error(err.message);
                              });
                        };
                        // const  ctCandidates = await Contracts.Candidates.deployed();
                        // await ctCandidates.addInfo(candidate, description, attachment || null, { from });
                  } catch(e) {
                        Log.error(e.message);
                        dispatch.alert.error(ms.notSaved);
                  } finally {
                        dispatch.loading.stop();
                  }
            },

            async getVotes (payload, {candidates}) {
                  try {
                        dispatch.loading.start();
                        const updated = [];
                        const  ctVoting = await Contracts.Voting.deployed();
                        await Promise.all (candidates.map( async ({name}) => {
                              const vote = await ctVoting.totalVotesFor(name);
                              updated.push({name, vote: vote.toString()});
                        }));
                        this.updateList(updated);
                  } catch(e) {
                        Log.error(e.message);
                        dispatch.alert.error(ms.retrieveVotesFailure);
                  } finally {
                        dispatch.loading.stop();
                  }
            },

            async addVote (candidate, {candidates, loading, user: {name, address}}) {
                  try {
                        dispatch.loading.start();
                        let updated = [...candidates];
                        const ctVoting = await Contracts.Voting.deployed();
                        await ctVoting.voteForCandidate(
                              web3.fromUtf8(candidate),
                              web3.fromUtf8(name),
                              {from: address, gas: 200000}
                        );
                        const vote = await ctVoting.totalVotesFor(candidate);
                        updated.unshift({name: candidate, vote: vote.toString()});
                        this.updateList(uniqBy(updated, 'name'));
                  } catch (e) {
                        Log.error(e.message);
                        dispatch.alert.error(ms.notEnoughFunds);
                  } finally {
                        dispatch.loading.stop();
                  }
            }
      }
}
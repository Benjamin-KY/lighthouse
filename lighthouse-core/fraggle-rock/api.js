/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const {snapshotGather} = require('./gather/snapshot-runner.js');
const {startTimespanGather} = require('./gather/timespan-runner.js');
const {navigationGather} = require('./gather/navigation-runner.js');
const Runner = require('../runner.js');
const UserFlow = require('./user-flow.js');

/**
 * @param {import('puppeteer').Page} page
 * @param {UserFlow.UserFlowOptions} [options]
 */
async function startFlow(page, options) {
  return new UserFlow(page, options);
}

/**
 * @param  {Parameters<navigationGather>} params
 * @return {Promise<LH.RunnerResult|undefined>}
 */
async function navigation(...params) {
  const gatherResult = await navigationGather(...params);
  return Runner.audit(gatherResult.artifacts, gatherResult.runnerOptions);
}

/**
 * @param  {Parameters<snapshotGather>} params
 * @return {Promise<LH.RunnerResult|undefined>}
 */
async function snapshot(...params) {
  const gatherResult = await snapshotGather(...params);
  return Runner.audit(gatherResult.artifacts, gatherResult.runnerOptions);
}

/**
 * @param  {Parameters<startTimespanGather>} params
 * @return {Promise<{endTimespan: () => Promise<LH.RunnerResult|undefined>}>}
 */
async function startTimespan(...params) {
  const {endTimespanGather} = await startTimespanGather(...params);
  const endTimespan = async () => {
    const gatherResult = await endTimespanGather();
    return Runner.audit(gatherResult.artifacts, gatherResult.runnerOptions);
  };
  return {endTimespan};
}

module.exports = {
  snapshot,
  startTimespan,
  navigation,
  startFlow,
};

/*!
 * (c) Copyright 2020 Micro Focus or one of its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

const Octane = require('@microfocus/alm-octane-js-rest-sdk').Octane;
const Query = require('@microfocus/alm-octane-js-rest-sdk/lib/query');
const fs = require('fs');

const octane = new Octane({
    server: 'SERVER',
    sharedSpace: 1234,
    workspace: 1234,
    user: 'API_KEY',
    password: 'API_SECRET',
    proxy: 'IF NEEDED',
    headers: {
        HPECLIENTTYPE: 'HPE_REST_API_TECH_PREVIEW'
    }
});

async function getTestSuite() {
    const test_suite = await octane.get('test_suite_link_to_tests')
        .query(Query.field('test_suite').equal(Query.field('id').equal(process.env.suiteId)).build())
        .fields('test')
        .execute();
    // should be just one test
    const testId = test_suite.data[0].test.id;
    const testParams = await octane.get('tests').at(testId).fields('param1_udf', 'param2_udf').execute();

    // get attachment
    const attachmentData = await octane.get('attachments')
        .query(Query.field('owner_test').equal(Query.field('id').equal(testId)).build())
        .fields('id')
        .execute()
        .catch(reason => {
            console.log(reason);
        });

    let attachmentContent;

    if (attachmentData) {
        let attachmentId = attachmentData.data[0].id;
        attachmentContent = await octane.getAttachmentContent(Octane.entityTypes.attachments).at(attachmentId).execute();
    }

    const results = {
        param1: testParams.param1_udf, // simple string
        param2: testParams.param2_udf, // memo table that can be parsed to get key/value
        attachment: attachmentContent // the JSON attachment as a native object
    };

    fs.writeFileSync('nodeOutput.json', JSON.stringify(results));
}

getTestSuite();
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

async function createAutomaticTest() {
    // upload new automatic test
    const newAutomatedTestId =
        await octane.create('automated_tests',
            {
                name: 'test1',
                param1_udf: 'Param1',
                param2_udf: '<html><body><table border="1" cellspacing="1" style="border-spacing:1px;width:500px;"><tbody><tr><td>key1</td><td>value1</td></tr><tr><td>key2</td><td>value2</td></tr><tr><td>key3</td><td>value3</td></tr></tbody></table></body></html>'
            })
            .execute()
            .catch(reason => {
                console.log(reason.toString());
            }).data[0].id;

    // upload attachment
    await octane.uploadAttachment('attachment.json', {attach: {attach1: 'hi'}}, 'owner_test', newAutomatedTestId)
        .execute().catch(reason => {
            console.log(reason.toString());
        });
}

createAutomaticTest();
export function configureFakeBackend() {
    // array in local storage for concept records
    let concepts = JSON.parse(localStorage.getItem('concepts')) || [{ 
        id: 1,
        displayName: 'Diagnosis',
        description: 'Entity Domain',
        parents: 'Parent1,Parent2',
        children: 'Child1,Child2',
        alternateNames: 'Name1,Name2'
    }];

    // monkey patch fetch to setup fake backend
    let realFetch = window.fetch;
    window.fetch = function (url, opts) {
        return new Promise((resolve, reject) => {
            // wrap in timeout to simulate server api call
            setTimeout(handleRoute, 500);

            function handleRoute() {
                if (url.endsWith('/concepts') || url.match(/\/concepts\/\d+$/))
                {
                    const { method } = opts;
                    switch (true) {
                        case url.endsWith('/concepts') && method === 'GET':
                            return getConcepts();
                        case url.match(/\/concepts\/\d+$/) && method === 'GET':
                            return getConceptById();
                        case url.endsWith('/concepts') && method === 'POST':
                            return createConcept();
                        case url.match(/\/concepts\/\d+$/) && method === 'PUT':
                            return updateConcept();
                        case url.match(/\/concepts\/\d+$/) && method === 'DELETE':
                            return deleteConcept();
                        default:
                            // pass through any requests not handled above
                            return realFetch(url, opts)
                                .then(response => resolve(response))
                                .catch(error => reject(error));
                    }
                }
            }

            // route functions

            function getConcepts() {
                return ok(concepts);
            }

            function getConceptById() {
                let concept = concepts.find(x => x.id === idFromUrl());
                return ok(concept);
            }
    
            function createConcept() {
                const concept = body();

                if (concepts.find(x => x.displayName === concept.displayName)) {
                    return error(`Concept with the display name ${concept.displayName} already exists`);
                }

                // assign concept id and a few other properties then save
                concept.id = newConceptId();
                concept.dateCreated = new Date().toISOString();
                concepts.push(concept);
                localStorage.setItem('concepts', JSON.stringify(concepts));

                return ok();
            }
    
            function updateConcept() {
                let params = body();
                let concept = concepts.find(x => x.id === idFromUrl());

                // update and save concept
                Object.assign(concept, params);
                localStorage.setItem('concepts', JSON.stringify(concepts));

                return ok();
            }
    
            function deleteConcept() {
                concepts = concepts.filter(x => x.id !== idFromUrl());
                localStorage.setItem('concepts', JSON.stringify(concepts));

                return ok();
            }
    
            // helper functions

            function ok(body) {
                resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(body)) });
            }

            function error(message) {
                resolve({ status: 400, text: () => Promise.resolve(JSON.stringify({ message })) });
            }

            function idFromUrl() {
                const urlParts = url.split('/');
                return parseInt(urlParts[urlParts.length - 1]);
            }

            function body() {
                return opts.body && JSON.parse(opts.body);    
            }

            function newConceptId() {
                return concepts.length ? Math.max(...concepts.map(x => x.id)) + 1 : 1;
            }
        });
    }
};
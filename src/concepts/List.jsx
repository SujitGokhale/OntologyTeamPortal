import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { conceptService } from '../_services/concept.service';

function List({ match }) {
    const { path } = match;
    const [concepts, setConcepts] = useState(null);

    useEffect(() => {
        conceptService.getAll().then(x => setConcepts(x));
    }, []);

    function deleteConcept(id) {
        setConcepts(concepts.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        }));
        conceptService.delete(id).then(() => {
            setConcepts(concepts => concepts.filter(x => x.id !== id));
        });
    }

    return (
        <div>
            <h1>Ontology Concepts</h1>
            <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Add Concept</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '20%' }}>Name</th>
                        <th style={{ width: '40%' }}>Description</th>
                        <th style={{ width: '30%' }}>Parents</th>
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {concepts && concepts.map(concept =>
                        <tr key={concept.id}>
                            <td>{concept.displayName}</td>
                            <td>{concept.description}</td>
                            <td>{concept.parents}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`${path}/edit/${concept.id}`} className="btn btn-sm btn-primary mr-1">Edit</Link>
                                <button onClick={() => deleteConcept(concept.id)} className="btn btn-sm btn-danger btn-delete-concept" disabled={concept.isDeleting}>
                                    {concept.isDeleting 
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }
                                </button>
                            </td>
                        </tr>
                    )}
                    {!concepts &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="spinner-border spinner-border-lg align-center"></div>
                            </td>
                        </tr>
                    }
                    {concepts && !concepts.length &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="p-2">No Concepts To Display</div>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}

export { List };
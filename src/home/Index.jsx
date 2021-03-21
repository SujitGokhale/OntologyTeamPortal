import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            <h1>Ontology Operations</h1>
            <p>Prototype application to list, add, edit and delete master ontology concept records.</p>
            <p><Link to="concepts">&gt;&gt; Manage Master Ontology Concepts</Link></p>
        </div>
    );
}

export { Home };
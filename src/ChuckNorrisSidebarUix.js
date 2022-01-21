import { useState, useEffect } from 'react';

import {
    Wrapper,
    useUiExtension,
} from '@graphcms/uix-react-sdk'

import axios from 'axios';

const ChuckNorrisWidget = () => {
    const { sidebarConfig, form: { subscribeToFieldState, change } } = useUiExtension();
    const [ title, setTitle ] = useState('');
    const [ content, setContent ] = useState('');
    
    const titleField = sidebarConfig.TITLE_FIELD;
    const contentField = sidebarConfig.CONTENT_FIELD;

    useEffect(() => {

        let unsubscribe;
        subscribeToFieldState(
            titleField, 
            (state) => {
                setTitle(state.value);
            }
        ).then(fieldUnsubscribe => unsubscribe = fieldUnsubscribe);

        return () => {
            unsubscribe?.()
        };
        
    },[subscribeToFieldState, titleField]);

    useEffect(() => {

        let unsubscribe;
        subscribeToFieldState(
            contentField, 
            (state) => {
                setContent(state.value);
            }
        ).then(fieldUnsubscribe => unsubscribe = fieldUnsubscribe);

        return () => {
            unsubscribe?.()
        };

    }, [subscribeToFieldState, contentField]);

    const generateTitle = () => {
        axios.get('https://api.chucknorris.io/jokes/random').then((response) => {
            console.log(response);
            if(response?.data?.value) {
                let newText = response?.data?.value;
                console.log('newTitle:', newText);
                change(`${titleField}`, newText);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    const generateContent = () => {
        axios.get('https://vincentloy.github.io/chuck_facts_ipsum/assets/chuck.min.json').then((response) => {
            console.log(response);
            if(response?.data?.facts) {
                const totalFacts = response?.data?.facts.length;
                const random = Math.floor(Math.random() * totalFacts);
                let newText = response?.data?.facts[random];
                console.log('newContent:', newText);
                change(`${contentField}`, newText);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    const btnStyle = {
        alignItems: 'center',
        backgroundColor: '#32c48d',
        border: '0',
        borderRadius: '4px',
        color: '#ffffff',
        display: 'inline-flex',
        fontWeight: '500px',
        height: '32px',
        lineHeight: '16px',
        marginBottom: '8px',
        padding: '1px 12px',
        textAlign: 'center',
        verticalAlign: 'middle',
    };

    return (
        <>
            <button style={btnStyle} onClick={generateTitle}>Generate Title</button><br />
            <button style={btnStyle} onClick={generateContent}>Generate Content</button>
        </>
    );
};

const declaration = {
    name: 'Chuck Norris Content Generator',
    description: 'Ask Chuck Norris what it does',
    extensionType: 'formSidebar',
    // Global configuration
    // config: {
    //     API_KEY: {
    //         type: 'string',
    //         displayName: 'API Key',
    //         description: 'Enter your Google Translate API Key',
    //         required: true,
    //     }
    // },
    // Sidebar UI Extension only
    // This is an instance configuration
    sidebarConfig: {
        TITLE_FIELD: {
            type: 'string',
            displayName: 'Title Field',
            description: 'Enter title field apiId',
            required: true,
        },
        CONTENT_FIELD: {
            type: 'string',
            displayName: 'Content Field',
            description: 'Enter content field apiId. Warning: Rich text field are not supported.',
            required: true,
        }
    }
};

const ChuckNorrisSidebarExtension = () => {
    return (
        <Wrapper declaration={declaration}>
            <ChuckNorrisWidget />
        </Wrapper>
    )
}

export default ChuckNorrisSidebarExtension;
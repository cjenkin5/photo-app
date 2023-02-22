import {getAccessToken} from './utilities.js';
const rootURL = 'https://photo-app-secured.herokuapp.com';

const showStories = async (token) => {
    const endpoint = `${rootURL}/api/stories`;
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    const data = await response.json();
    console.log('Stories:', data);
    const htmlChunk= data.map(storyToHtml).join('')
    document.querySelector('#stories-panel').innerHTML= htmlChunk;
}

const storyToHtml=(story)=>{
    return `
        <section>
            <img src="${story.user.thumb_url}" />
            <p>${story.user.username}</p>
        </section>
    `
}

const showSugProfile = async (token) => {
    const endpoint = `${rootURL}/api/profile`;
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ token
        }
    })
    const data = await response.json();
    console.log('Profile: ', data);
    //const htmlChunk= data.map(sugProfToHtml).join('')
    const htmlChunk = sugProfToHtml(data);
    console.log(htmlChunk);
    document.querySelector('.Suggestions').innerHTML= htmlChunk;
}

const sugProfToHtml = (prof) =>{
    return `
    <img class="prof" src="${prof.image_url}">
    <section>${prof.username}</section>
    `
}


const showSuggestions = async (token) => {
    const endpoint = `${rootURL}/api/suggestions/`;
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ token
        }
    })
    const data = await response.json();
    console.log('Suggestions: ', data);
    const htmlChunk2= data.map(suggestionToHtml).join('')
    const htmlChunk = `<span>Suggestions for you</span>`+htmlChunk2
    document.querySelector('.sug-panel').innerHTML= htmlChunk;

}

const suggestionToHtml = (sug) =>{
    return `
    <div id="panel-1">
        <img class="prof" src="${sug.image_url}">
        <section id="user1">${sug.username}</section>
        <p>Suggested for you</p>
        <button class="follow-button">follow</button>
     </div>`
}


const showPosts = async (token) => {
    console.log('code to show posts');
}


const initPage = async () => {
    // first log in (we will build on this after Spring Break):
    const token = await getAccessToken(rootURL, 'webdev', 'password');
    console.log(token);
    // then use the access token provided to access data on the user's behalf
    showStories(token);
    showPosts(token);
    showSugProfile(token);
    showSuggestions(token);
}

initPage();

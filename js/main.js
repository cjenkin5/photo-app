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
            <button>${story.user.username}</button>
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
    const endpoint = `${rootURL}/api/posts`;
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ token
        }
    })
    const data = await response.json();
    console.log('posts: ', data);
}

const showCommentAndButton = post => {
    //to do, don't show button if no button is needed
    const hasComments = post.comments.length > 0;
    if(hasComments){
        return ``
    }
}

const postToHtml = post => {
    return `
    <section>
        <img src = "${post.image_url}"/>
        <p>This is a caption</p>
    </section>`

    // &{post.comment.length > 0 ? post.comments[0].text : ''}
}


//for all event handlers attached to dynamic html,
//need to add those to a window. So instead of const
// show modal, its 
//window.showModal = function() =>{

//}

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

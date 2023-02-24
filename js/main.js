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
    const htmlChunk2 = upperUsername(data);
    console.log(htmlChunk);
    document.querySelector('.Suggestions').innerHTML= htmlChunk;
    document.querySelector('.username').innerHTML = htmlChunk2
}

const sugProfToHtml = (prof) =>{
    return `
    <img class="prof" src="${prof.image_url}">
    <section>${prof.username}</section>
    `
}

const upperUsername = prof => {
    return `${prof.username}`
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
    const htmlChunk = data.map(postToHtml).join('');
    document.querySelector('.main-feed').innerHTML = htmlChunk;
}

const showCommentAndButton = post => {
    //to do, don't show button if no button is needed
    const hasComments = post.comments.length > 0;
    if(hasComments){
        return `
        <p class="comments">
            <button class = "com-button">
                View all ${post.comments.length} comments
            </button><br>
            <span class="username-poster">
                ${post.comments.length > 0 ? post.comments[post.comments.length-1].user.username : ''}
            </span>
            <span class="com">
                ${post.comments.length > 0 ? post.comments[post.comments.length-1].text : ''}
            </span>
            <p class = "days-ago">
            ${post.comments.length > 0 ? post.comments[post.comments.length-1].display_time : ''}
            </p>

        </p>
        `
    }
    else{
        return ``
    }
}
// <button class="more">more</button>

const isLiked = post => {
    if(post.current_user_like_id != undefined){
        return `<i id="liked" class="fas fa-heart"></i>`
    }else{
        return `<i id="notLiked" class="far fa-heart"></i>`
    }
}

const isBookmarked = post => {
    if(post.current_user_bookmark_id != undefined){
        return `<i class="fas fa-bookmark"></i>`
    }
    else{
        return `<i class="far fa-bookmark"></i>`
    }

}

const postToHtml = post => {
    return `
    <header class="photo-feed">
                <div class="post-bar-top">
                    <p>${post.user.username}</p>
                    <button>
                        <i id="top" class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
                <img class="post" src="${post.image_url}">
                <div class="post-bar-bottom">
                    <section class="bottom-icons">
                        <button>
                            ${isLiked(post)}
                        </button>
                        <button>
                            <i class="far fa-comment"></i>
                        </button>
                        <button>
                            <i class="far fa-paper-plane"></i>
                        </button>
                    </section>
                    <button class="bookmark">
                        ${isBookmarked(post)}
                    </button>
                </div>
                <div class="comment-section">
                    <p class="like-count">${post.likes.length} likes</p>
                    <p class = "caption">
                        <strong>${post.user.username}</strong>
                        ${post.caption}
                    </p>
                    <p class = "days-ago">
                        ${post.display_time}
                    </p>
                    ${showCommentAndButton(post)}
                    <hr class="com-line">
                    <section class = "add-comm">
                        <input type="text" id="add-c" placeholder="Add a comment...">

                        <button class="post-com-button">Post</button>
                    </section>
                </div>
            </header>`

    // &{post.comment.length > 0 ? post.comments[0].text : ''}
}


//for all event handlers attached to dynamic html,
//need to add those to a window. So instead of const
// show modal, its 
window.showModal = function() {
    return``
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

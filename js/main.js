import {getAccessToken} from './utilities.js';
const rootURL = 'https://photo-app-secured.herokuapp.com';

let token;

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
    console.log('sug.id', sug.id)
    return `
    <div id="panel-1">
        <img class="prof" src="${sug.image_url}">
        <section id="user1">${sug.username}</section>
        <p>Suggested for you</p>
        <button class="follow-button" id="follow_button_${sug.id}" onclick="followAccount(${sug.id})">follow</button>
     </div>`
}

const isFollowing = async sugID =>{
    const endpoint = `${rootURL}/api/following/`;
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY3ODcyMzE1OSwianRpIjoiMDFlNjNkZDktM2ZlMi00NjdiLWI2YjItODdmMTBlMWEyNjM4IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MSwibmJmIjoxNjc4NzIzMTU5LCJjc3JmIjoiYjg3MmY0YWItZTcyOC00YTdhLWI2NjEtYTBlNmJmMTI1YWEyIiwiZXhwIjoxNjc4NzI0MDU5fQ.I5z7bJ5NLwW69xEIAFpxkZTxvVcy2EBR2GKr9wQiib0'
        }
    });
    const data = await response.json();
    console.log(data);
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
            <button class = "com-button" onclick="showModal(${post.id})">
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
        return `
        <button onclick="unlikePost(${post.current_user_like_id}, ${post.id})">
            <i id="liked" class="fas fa-heart"></i>
        </button>`
    }else{
        return `
        <button onclick="likePost(${post.id})">
            <i id="notLiked" class="far fa-heart"></i>
        </button>`
    }
}


window.likePost = async (postID) => {
    // define the endpoint:
    const endpoint = `${rootURL}/api/posts/likes/`;
    const postData = {
        "post_id": postID
    };

    // Create the bookmark:
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(postData)
    })
    const data = await response.json();
    console.log(data);
    requeryRedraw(postID);
}


window.unlikePost = async (likeID, postID) => {
    // define the endpoint:
    const endpoint = `${rootURL}/api/posts/likes/${likeID}`;

    // Create the bookmark:
    const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    const data = await response.json();
    console.log(data);
    requeryRedraw(postID);
}


const isBookmarked = post => {
    if(post.current_user_bookmark_id != undefined){
        return `
        <button class="bookmark" onclick="unbookmarkPost(${post.current_user_bookmark_id}, ${post.id})">
            <i class="fas fa-bookmark"></i>
        </button>`
    }
    else{
        return `
        <button class="bookmark" onclick="bookmarkPost(${post.id})">
            <i class="far fa-bookmark"></i>
        </button>`
    }

}

window.bookmarkPost = async (postID) => {
    // define the endpoint:
    const endpoint = `${rootURL}/api/bookmarks/`;
    const postData = {
        "post_id": postID
    };

    // Create the bookmark:
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(postData)
    })
    const data = await response.json();
    console.log(data);
    requeryRedraw(postID);
}

window.unbookmarkPost = async (bookmarkID, postID) => {
    // define the endpoint:
    const endpoint = `${rootURL}/api/bookmarks/${bookmarkID}`;

    // Create the bookmark:
    const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    const data = await response.json();
    console.log(data);
    requeryRedraw(postID);
}

const postToHtml = post => {
    return `
    <header class="photo-feed" id="post_${post.id}">
                <div class="post-bar-top">
                    <p>${post.user.username}</p>
                    <button>
                        <i id="top" class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
                <img class="post" src="${post.image_url}">
                <div class="post-bar-bottom">
                    <section class="bottom-icons">
                            ${isLiked(post)}
                        <button>
                            <i class="far fa-comment"></i>
                        </button>
                        <button>
                            <i class="far fa-paper-plane"></i>
                        </button>
                    </section>
                        ${isBookmarked(post)}
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
                    <section class = "add-comm" id="post_com_${post.id}">
                        <input type="text" id="add-c" class="com_${post.id}" placeholder="Add a comment...">

                        <button class="post-com-button" onclick="addComment(${post.id})">Post</button>
                    </section>
                </div>
            </header>`

    // &{post.comment.length > 0 ? post.comments[0].text : ''}
}


window.addComment = async (postID) => {
    const text = document.querySelector(`.com_${postID}`).value
    // define the endpoint:
    const endpoint = `${rootURL}/api/comments`;
    const postData = {
        "post_id": postID,
        "text": `${text}`
    };

    // Create the bookmark:
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    })
    const data = await response.json();
    console.log(data);
    requeryRedraw(postID);
}


window.followAccount = async (sugID) => {
    // define the endpoint:
    const endpoint = `${rootURL}/api/following`;
    const postData = {
        "user_id": sugID,
    };

    // Create the bookmark:
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(postData)
    })
    const data = await response.json();
    console.log(data);
    redrawButton(sugID, data.id);
}

const redrawButton = async (sugid, dataid) =>{
    document.querySelector(`#follow_button_${sugid}`).innerHTML = 'unfollow'
    document.querySelector(`#follow_button_${sugid}`).setAttribute('onclick', `unfollowAccount(${dataid}, ${sugid})`)
}

window.unfollowAccount = async (dataID, sugID) =>{
       // define the endpoint:
       const endpoint = `${rootURL}/api/following/${dataID}`;
   
       // Create the bookmark:
       const response = await fetch(endpoint, {
           method: "DELETE",
           headers: {
               'Content-Type': 'application/json',
               'Authorization': 'Bearer ' + token
           }
       })
       const data = await response.json();
       console.log(data);
       redrawButton2(sugID);
}

const redrawButton2 = async sugid =>{
    document.querySelector(`#follow_button_${sugid}`).innerHTML = 'follow'
    document.querySelector(`#follow_button_${sugid}`).setAttribute('onclick', `followAccount(${sugid})`)
}


const requeryRedraw = async postId =>{
    const endpoint = `${rootURL}/api/posts/${postId}`;
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    const data = await response.json();
    console.log(data);
    const htmlChunk = postToHtml(data);
    targetElementAndReplace(`#post_${postId}`, htmlChunk);

}

const targetElementAndReplace = (selector, newHTML) => { 
	const div = document.createElement('div'); 
	div.innerHTML = newHTML;
	const newEl = div.firstElementChild; 
    const oldEl = document.querySelector(selector);
    oldEl.parentElement.replaceChild(newEl, oldEl);
}

//for all event handlers attached to dynamic html,
//need to add those to a window. So instead of const
// show modal, its 
const modalElement= document.querySelector('.modal');

window.showModal = function(postId) {
    modalElement.classList.remove('hidden');
    modalElement.setAttribute('aria-hidden', 'false');
    document.querySelector('.close').focus();
    console.log(postId)
    modalContent(postId)
    //const htmlChunk = data.map(postToHtml).join('');



}

const modalContent = async postId =>{
    const endpoint = `${rootURL}/api/posts/${postId}`;
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ token
        }
    })
    const data = await response.json();
    console.log('post: ', data);
    const htmlChunk1 = showModalCaption(data)
    const htmlChunk2 = showModalImage(data)
    const htmlChuckProf = showModalProfile(data)
    // const element = document.querySelector('.image')
    // element.remove()
    let element = document.querySelector('.image')
    element.setAttribute("style",htmlChunk2)
    const hasComments=data.comments.length>0
    if(hasComments){
        const htmlChunk3 = data.comments.map(ShowModalContent).join('');
        const htmlChunk = htmlChuckProf+htmlChunk1+htmlChunk3;
        document.querySelector('.modal-comments').innerHTML=htmlChunk
    }else{
        const htmlChunk = htmlChuckProf+htmlChunk1
        document.querySelector('.modal-comments').innerHTML = htmlChunk;
    }
    //document.querySelector('.model-comments').innerHTML = htmlChunk;
}

const ShowModalContent = comment => {
    console.log(comment)
    return `
    <section class="comment-modal-ind">

        <img class="modal-image" src="${comment.user.image_url}">
        <div class = "modal-text">
        <span class="username-poster">
            ${comment.user.username}
        </span>
        <span class="com">
            ${comment.text}
        </span>
        <p class = "days-ago">
            ${comment.display_time}
        </p>
        </div>
        <button class="modal-like-button">
            <i id="like-for-modal-comment" class="far fa-heart"></i>
        </button>
    </section>`
}

const showModalCaption = post =>{
    return `<section class = "modal-caption">
    <img class="modal-image" src="${post.user.image_url}">
    <div class="modal-text-caption">
        <span class="username-poster">
            ${post.user.username}
        </span>
        <span class="com">
            ${post.caption}
        </span>
        <p class = "days-ago">
        ${post.display_time}
        </p>
    </div>
    <button class="modal-like-button">
            <i id="like-for-modal-comment" class="far fa-heart"></i>
    </button>
</section>`
}

const showModalImage = post =>{
    return `background-image: url('${post.image_url}');`
}

const showModalProfile = post =>{
    return `
    <section class="modal-profile-container">
    <div class="modal-profile">
        <img class="modal-image-profile" src="${post.user.image_url}">
        <span class="modal-profile-username">
            ${post.user.username}
        </span>
    </div>
    </section>`
}

window.closeModal = function(){
    modalElement.classList.add('hidden');
    modalElement.setAttribute('aria-hidden', 'true');
    document.querySelector('.com-button').focus();
}

const initPage = async () => {
    // first log in (we will build on this after Spring Break):
    token = await getAccessToken(rootURL, 'chase', 'chase_password');
    console.log(token);
    // then use the access token provided to access data on the user's behalf
    showStories(token);
    showPosts(token);
    showSugProfile(token);
    showSuggestions(token);
}

initPage();

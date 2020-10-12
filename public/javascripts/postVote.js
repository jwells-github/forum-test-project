function upvotePost(postID, element){
  fetchPost('../../vote/post/'+postID+'/1').then(response =>{
    if(response.status === 200){
      element.nextSibling.nextSibling.classList.remove('downvote');
      toggleClass(element, 'upvote');
    }
    else{
    } 
  });
}

function downvotePost(postID, element){
  fetchPost('../../vote/post/'+postID+'/0').then(response =>{
    if(response.status === 200){
      element.previousSibling.previousSibling.classList.remove('upvote');
      toggleClass(element, 'downvote');
    }
    else{
    }
  });
}

function upvoteComment(commentID, element){
  fetchPost('../../vote/comment/'+commentID+'/1').then(response =>{
    if(response.status === 200){
      element.nextSibling.classList.remove('downvote');
      toggleClass(element, 'upvote')
    }
    else{
    } 
  });
}

function downvoteComment(commentID, element){
  fetchPost('../../vote/comment/'+commentID+'/0').then(response =>{
    if(response.status === 200){
      element.previousSibling.classList.remove('upvote');
      toggleClass(element, 'downvote')
    }
    else{
    } 
  });
}

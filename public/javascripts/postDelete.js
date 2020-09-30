function deletePost(postID, element){
  fetchPost('../../delete/post/'+postID).then(response =>{
    if(response.status === 200){
      toggleClass(element.parentNode, 'active'); 
      element.parentNode.parentNode.nextSibling.innerHTML = 'Post Deleted'
    }
    else{
      element.parentNode.parentNode.nextSibling.innerHTML= 'Something went wrong, please try again shortly.';
    } 
  });
}

function deleteComment(commentID, element){
  fetchPost('../../delete/comment/'+commentID).then(response =>{
    if(response.status === 200){
      // Hide option and display confirmation
      toggleClass(element.parentNode, 'active');
      element.parentNode.parentNode.parentNode.previousSibling.childNodes[0].innerHTML = 'Comment Deleted'
    }
    else{
      element.parentNode.parentNode.parentNode.previousSibling.childNodes[0].innerHTML = 'Something went wrong, please try again shortly.'
    }
  });
}

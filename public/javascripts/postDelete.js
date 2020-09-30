function deletePost(postID, element){
  fetchPost('../../delete/post/'+postID).then(response =>{
    if(response.status === 200){
      toggleClass(element.parentNode.parentNode.parentNode, 'delete-hide'); 
    }
    else{
      element.previousSibling.nodeValue = 'Something went wrong, please try again shortly.';
    } 
  });
}

function deleteComment(commentID, element){
  fetchPost('../../delete/comment/'+commentID).then(response =>{
    if(response.status === 200){
      // Hide option and display confirmation
      toggleClass(element.parentNode, 'active');
      document.getElementById('action-message').innerHTML = 'Comment deleted'
    }
    else{
      element.previousSibling.nodeValue = 'Something went wrong, please try again shortly.';
    } 
  });
}

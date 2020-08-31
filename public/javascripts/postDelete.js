function deletePost(postID, subredditName, element){
  fetchPost(subredditName+'/delete/'+postID).then(response =>{
    if(response.status === 200){
      toggleClass(element.parentNode.parentNode.parentNode, 'delete-hide'); 
    }
    else{
      element.previousSibling.nodeValue = 'Something went wrong, please try again shortly.';
    } 
  });
}

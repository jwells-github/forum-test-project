function toggleConfirmation(element){
  let parentNode = element.parentNode;
  toggleClass(parentNode,'active');
  let parentSibling = (parentNode.nextSibling === null ? parentNode.previousSibling : parentNode.nextSibling);
  toggleClass(parentSibling,'active');
}

function toggleClass(element,className){
  if(element.classList.contains(className)){
    element.classList.remove(className)
  }
  else{
    element.classList.add(className);
  }
}

export {toggleClass};
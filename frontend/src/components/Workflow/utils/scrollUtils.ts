
const cumulativeOffset = (element: any) => {
    let top = 0, left = 0;
    do {
        top += element.offsetTop || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
    } while (element);

    return {
        top: top,
        left: left
    };
};

export const goToNewAction = (ref: React.RefObject<any>) => {
    // Give it some time until the accordion is expanded, then do the scroll: 
    // (The expansion of the accordion will increase the document height, which will allow the scroll to scroll down until it reaches the top of the ref.current)
    setTimeout(() => {
        scrollToNewAction(ref);
    }, 500);
}
const scrollToNewAction = (ref: React.RefObject<any>) => {
    // Calculate the distance from the element to the top of the page (to the highest ancestor element):
    let cumulativeOffsetTop = cumulativeOffset(ref.current).top;

    // console.log("offsetTop: ", ref.current?.offsetTop);
    console.log("cumulativeOffsetTop: ", cumulativeOffsetTop);

    window.scrollTo({
        top: cumulativeOffsetTop - 75,
        behavior: 'smooth'
    });
}

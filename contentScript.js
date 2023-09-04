let links = document.querySelectorAll('a');
//filter links to only include ones with youtube in the href
links = Array.from(links).filter(link => link.href.includes('youtube') || link.href.includes('youtu.be'));
//add a purple background to each link

links.forEach(link => {
    //extract the video id from the link
    let videoId = link.href.split('v=')[1];
    //if the link is a youtu.be link, extract the video id from the link
    if (!videoId) {
        videoId = link.href.split('youtu.be/')[1];
    }
    if (!videoId)
        return
    videoId = videoId.split('&')[0];
    console.log(videoId);
    link.innerHTML = `<div class="hoverable"> <span class="hoverable__main">${link.innerHTML}</span><span class="hoverable__tooltip"><img src="https://img.youtube.com/vi/${videoId}/0.jpg" alt="Description of the image"></span> </div>`;
});

const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.addedNodes.length > 0) {
            // Handle added nodes here
            let new_nodes = Array.from(mutation.addedNodes);
            new_nodes = new_nodes.filter(node => node.tagName === 'A');
            for (let node of new_nodes) {

            }
        }

    });
});

// Start observing the document
observer.observe(document, { childList: true, subtree: true });

let links = Array.from(document.querySelectorAll('a[href*="youtube."]:not(:has(.hoverable)), a[href*="youtu.be"]:not(:has(.hoverable))'));

links.forEach(node => {
    addOverlay(node);
});

const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.addedNodes.length > 0) {
            let new_nodes = Array.from(document.querySelectorAll('a[href*="youtube."]:not(:has(.hoverable)), a[href*="youtu.be"]:not(:has(.hoverable))'));
            for (let node of new_nodes) {
                addOverlay(node);
            }

            let newn = Array.from(document.querySelectorAll('a:not(:has(.hoverable))'));
            for (let node of newn) {
                node.innerHTML = `<div class="hoverable"> <span class="hoverable__main">${node.innerHTML}</span><span class="hoverable__tooltip"><img src="https://i.ytimg.com/vi/2QSPk9uIfyI/maxresdefault.jpg" alt="Description of the image"> <div class="overlay-text"> ajaajajajjaj </div> </span> </div>`;
            }

        }

    });
});

function parseLink(link) {
    //extract the video id from the link
    let videoId = link.split('v=')[1];
    //if the link is a youtu.be link, extract the video id from the link
    if (!videoId) {
        videoId = link.split('youtu.be/')[1];
    }
    if (!videoId)
        return undefined
    videoId = videoId.split('&')[0];
    videoId = videoId.split('?')[0];
    return videoId;
}

async function addOverlay(node) {
    let videoId = parseLink(node.href);
    if (!videoId)
        return;
    let data = await fetch(`https://youtube.com/oembed?url=${node.href}&format=json`).then((response) => response.json())

    node.innerHTML = `<div class="hoverable"> <span class="hoverable__main">${node.innerHTML}</span><span class="hoverable__tooltip"><img src="https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg" alt="Description of the image"> <div class="overlay-text"> ${data.title} </div> </span> </div>`;
}

// Start observing the document
observer.observe(document, { childList: true, subtree: true });

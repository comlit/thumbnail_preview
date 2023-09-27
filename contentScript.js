let selector = "a[href*='instagram.']:not(:has(.hoverable)), a[href*='tiktok.']:not(:has(.hoverable)), a[href*='youtube.']:not(:has(.hoverable)), a[href*='youtu.be']:not(:has(.hoverable))"

let links = Array.from(document.querySelectorAll(selector));

//links = document.querySelectorAll('a')


links.forEach(node => {
    addmarker(node);
    addlister(node);
});

const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.addedNodes.length > 0) {
            let new_nodes = Array.from(document.querySelectorAll(selector));

            //new_nodes = Array.from(document.querySelectorAll('a'))

            //filter out the nodes that already have a marker
            new_nodes = new_nodes.filter(node => node.getAttribute('data-hoverable') !== 'true');

            for (let node of new_nodes) {
                addmarker(node);
                addlister(node);
            }
        }
    });
});

// Start observing the document
observer.observe(document, { childList: true, subtree: true });


let div = document.createElement('div');
div.className = 'move';

document.body.appendChild(div);

let elem = document.querySelector('.mover')
let over = false
let id = 187
let dimens = { width: 80, height: 40 }
let pos = { x: 0, y: 0 }


// element mousemove to stop 
document.body.addEventListener('mousemove', function (e) {
    if (over) {
        pos.x = e.pageX;
        pos.y = e.pageY;
        positionOverlay()
    }
}, true);

function positionOverlay() {
    let left = pos.x + 5
    let top = pos.y + 15

    if (left > window.innerWidth - dimens.width - 15) {
        //right
        left = window.innerWidth - dimens.width - 15
    }

    if (top > window.innerHeight - dimens.height - 15) {
        //bottom
        top = pos.y - dimens.height - 15
    }
    div.style.left = `${left}px`;
    div.style.top = `${top}px`;
}

function addlister(element) {
    element.addEventListener("mouseleave", function (event) {
        over = false;
        removeOverlay()
    }, false);
    element.addEventListener("mouseover", function (event) {
        over = true;
        id = Math.random() * 10000
        addOverlay(element, id)
    }, false);
}

function addmarker(node) {
    //add a marker to the link to prevent it from being processed again
    node.setAttribute('data-hoverable', 'true');
}

async function addOverlay(elem, pid) {
    let href = elem.href;
    let parsed = parselinks(href);

    //just here for testing should be below the parsed check
    //show loading animation


    if (!parsed)
        return;

    div.innerHTML = '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>'
    dimens = { width: 80, height: 40 }

    switch (parsed.type) {
        case "yt":
            await showyt(parsed, pid);
            break;
        case "tt":
            await showtt(parsed, pid);
            break;
        case "ig":
            showig(parsed, pid);
            break;
    }
}

function parselinks(link) {
    let ytregex = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/; //maybe add support for yt profiles later
    let ttregex = /^.*(tiktok\.com\/)([^#\&\?]*).*/; //diferentiate between profile and video
    let igprofileregex = /instagram\.com\/\w*\/$/;

    let ytmatch = link.match(ytregex);
    let ttmatch = link.match(ttregex);
    let igprofilematch = link.match(igprofileregex);

    if (!ytmatch && !ttmatch && !igprofilematch)
        return undefined;

    if (ytmatch)
        return { type: "yt", data: ytmatch?.[2] };
    if (ttmatch)
        return { type: "tt", data: link };
    if (igprofilematch)
        return { type: "ig", data: link + "embed/" };
}

async function showyt(data, pid) {
    let videoId = data.data;
    let ytdata = await fetch(`https://youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`).then((response) => response.json())

    if (over && id == pid)
        div.innerHTML = `<div> <img src="https://img.youtube.com/vi/${videoId}/maxresdefault.jpg" alt="Youtube Video" class=hoverimage> <div class="overlay-text"> ${ytdata.title} </div> </div>`;

    changedimensions(pid)
}

async function showtt(data, pid) {
    let ttdata;
    try {
        ttdata = await fetch(`https://www.tiktok.com/oembed?url=${data.data}`).then((response) => response.json())
    }
    catch (e) {
        console.log(e)
        showerror(pid)
        return;
    }
    if (data?.code == 400) {
        showerror(pid)
        return;
    }
    //diferentiate between profile and video


    if (over && id == pid)
        div.innerHTML = `<div> <img src="${ttdata.thumbnail_url}" alt="Tiktok Video" class=hoverimage  style="width: 200px;"> <div class="overlay-text" style="width: 170px;"> ${ttdata.title} </div> </div>`;

    changedimensions(pid)
}

function showig(data, pid) {
    if (over && id == pid) {
        div.innerHTML = `<iframe src="${data.data}" width="100%" height="100%" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`
        dimens.width = div.offsetWidth;
        dimens.height = div.offsetHeight;
        positionOverlay()
    }

}

function changedimensions(pid) {
    let img = document.querySelector('.hoverimage')
    if (!img)
        return;
    img.addEventListener('load', function () {
        if (id = pid) {
            dimens.width = div.offsetWidth;
            dimens.height = div.offsetHeight;
            positionOverlay()
        }
    })
}

/**
 * shows Error message in case of an error
 * @param {*} pid 
 */
async function showerror(pid) {
    if (over && id == pid)
        div.innerHTML = `<div class="errordiv"> ERROR</div>`;

}

function removeOverlay() {
    div.innerHTML = ""
}
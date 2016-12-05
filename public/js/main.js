var pointer1 = document.querySelector('#green-pointer');
var pointer2 = document.querySelector('#red-pointer');

function getBar(idx) {
    return document.querySelector('#bar' + idx);
}

function movePointer1ToIdx(idx) {
    return Velocity(pointer1, {
        translateX: 30 * idx,
        translateY: ['+=0', '-30']
    }, {
        duration: 700,
    });
}

function movePointer2ToIdx(idx) {
    return Velocity(pointer2, {
        translateX: [30 * idx],
        translateY: ['+=0', '-30']
    }, {
        duration: 700,
    });
}

function highlightBar(bar) {
    return Velocity(
        bar, {
            fill: '#ff9800'
        }
    );
}

function unhighlightBar(bar) {
    return Velocity(
        bar, {
            fill: '#057cb8'
        }
    );
}

var delay = function (ms, value) {
    ms = ms ? ms : 1000;
    return new Promise((resolve) => setTimeout(resolve, ms));
}

Promise.prototype.delay = function (ms) {
    return delay(ms, this);
}

function moveBarUp(barElem, amount) {
    return Velocity(barElem, { translateY: '+=' + amount })
}

function moveBarDown(barElem, amount) {
    return Velocity(barElem, { translateY: '-=' + amount })
}

function moveBarRight(barElem, amount) {
    return Velocity(barElem, { translateX: '+=' + amount })
}

function moveBarLeft(barElem, amount) {
    return Velocity(barElem, { translateX: '-=' + amount })
}

function swapIds(elem1, elem2) {
    var id1 = elem1.id;
    var id2 = elem2.id;
    elem1.id = 'tmp-id-for-swapping';
    elem2.id = id1;
    elem1.id = id2;
}

function swapBars(idx1, idx2) {
    var bar1 = getBar(idx1);
    var bar2 = getBar(idx2);

    if (bar1.getBBox().height < bar2.getBBox().height) {
        var tmp = bar1;
        bar1 = bar2;
        bar2 = tmp;
    }
    var height1 = bar1.getBBox().height;
    var height2 = bar2.getBBox().height;

    return Promise.all([
        highlightBar(bar1),
        highlightBar(bar2),
    ])
    .then(() => new Promise((resolve) => setTimeout(resolve, 500)))
    .then(() => moveBarUp(bar1, height2 + 10))
    .then(() => Promise.all([
            Velocity(bar1, {x: bar2.getBBox().x}),
            Velocity(bar2, {x: bar1.getBBox().x}),
        ])
    )
    .then(() => moveBarDown(bar1, height2 + 10))
    .then(() => new Promise((resolve) => setTimeout(resolve, 200)))
    .then(() => Promise.all([
            unhighlightBar(bar1),
            unhighlightBar(bar2),
        ])
    ).then(() => {
        swapIds(bar1, bar2);
    });
}

movePointer2ToIdx(1)
.delay(1000)
.then(() => Promise.all([highlightBar(getBar(0)), highlightBar(getBar(1))]))
.delay(700)
.then(() => Promise.all([unhighlightBar(getBar(0)), unhighlightBar(getBar(1))]))
.delay(500)
.then(() => Promise.all([movePointer1ToIdx(1), movePointer2ToIdx(2)]))
.delay(500)
.then(() => swapBars(1, 2))

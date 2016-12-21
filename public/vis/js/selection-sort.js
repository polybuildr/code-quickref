var pointer1 = document.querySelector('#darkblue-pointer');
var pointer2 = document.querySelector('#red-pointer');

var shortDuration = 500;
var longDuration = 1000;
var shortDelay = 500;
var longDelay = 1000;

function getBar(idx) {
    return document.querySelector('#bar' + idx);
}

function movePointerToIdx(pointer, idx, negativeOffset) {
    negativeOffset = negativeOffset ? negativeOffset : '-60';
    return Velocity(pointer, {
        translateX: 60 * idx,
        translateY: ['+=0', negativeOffset]
    }, {
        duration: longDuration,
    });
}

function movePointer1ToIdx(idx) {
    return movePointerToIdx(pointer1, idx);
}

function movePointer2ToIdx(idx) {
    return movePointerToIdx(pointer2, idx);
}

function movePointer3ToIdx(idx) {
    return movePointerToIdx(pointer3, idx);
}

function highlightBar(bar, fill) {
    fill = fill ? fill : '#ff9800';
    return Velocity(bar, {fill: fill}, shortDuration);
}

function unhighlightBar(bar) {
    return Velocity(bar, {fill: '#057cb8'}, shortDuration);
}

function dimBar(bar) {
    return Velocity(bar, {fill: '#01334d'}, shortDuration);
}

function delayPromise(ms) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, ms);
    });
}

Promise.prototype.delay = function (ms) {
    return this.then(() => delayPromise(ms));
}

Promise.delay = function (ms) {
    return delayPromise(ms);
}

function moveBarUp(barElem, amount) {
    return Velocity(barElem, { translateY: '+=' + amount })
}

function moveBarDown(barElem, amount) {
    return moveBarUp(barElem, -amount);
}

function moveBarRight(barElem, amount) {
    return Velocity(barElem, { translateX: '+=' + amount })
}

function moveBarLeft(barElem, amount) {
    return moveBarRight(barElem, -amount);
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

    return moveBarUp(bar1, height2 + 10)
    .then(() => Promise.all([
            Velocity(bar1, {x: bar2.getBBox().x}, longDuration),
            Velocity(bar2, {x: bar1.getBBox().x}, longDuration),
        ])
    )
    .then(() => moveBarDown(bar1, height2 + 10))
    .then(() => {
        swapIds(bar1, bar2);
    });
}

var stage = {
    _i: 0,
    _j: 0,
    _s: 0,
    stepIdx: 0,
    nextFuncs: [],
};

stage.swap = function (i, j) {
    stage.setNext(() => {
        var tmp = stage.elems[i];
        stage.elems[i] = stage.elems[j];
        stage.elems[j] = tmp;
        return swapBars(i, j).delay(longDelay);
    });
},

stage.currentPromise = new Promise(function (resolve) {
    stage.begin = resolve;
});

stage.setNext = function (actionFunc) {
    stage.nextFuncs.push(actionFunc);
}

stage.next = function () {
    stage.currentPromise = stage.currentPromise.then(stage.nextFuncs.shift());
}

stage.playAll = function () {
    stage.begin();
    while (stage.nextFuncs.length) {
        stage.next();
    }
}

stage.highlight2 = function (i, j) {
    stage.setNext(() => Promise.all([
        highlightBar((getBar(i))),
        highlightBar((getBar(j))),
    ]).delay(longDelay));
}

stage.highlightGreen = function (idx) {
    stage.setNext(() => highlightBar((getBar(idx)), '#00ff00').delay(longDelay));
}

stage.changeHighlightGreen = function (wasGreenIdx, makeGreenIdx) {
    stage.setNext(() => Promise.all([
        highlightBar((getBar(makeGreenIdx)), '#00ff00'),
        unhighlightBar((getBar(wasGreenIdx)))
    ]).delay(longDelay));
}

stage.uh1g2 = function (i, j) {
    stage.setNext(() => Promise.all([
        unhighlightBar(getBar(i)),
        highlightBar((getBar(j)), '#00ff00'),
    ]).delay(shortDelay));
}

stage.dim = function (idx) {
    stage.setNext(() => dimBar(getBar(idx)));
}

stage.setJ = function (j) {
    stage.setNext(() => {stage._j = j; return movePointer2ToIdx(j).delay(shortDelay)});
}

stage.setIdxs = function (i, j) {
    stage.setNext(() => {
        stage._i = i;
        stage._j = j;
        return Promise.all([
            movePointer1ToIdx(i),
            movePointer2ToIdx(j)
        ]).delay(shortDelay);
    });
}

var elems = [90, 150, 50, 90, 70, 30];

stage.elems = elems.slice();

for (var i = 0; i < stage.elems.length; i++) {
    getBar(i).setAttribute('height', stage.elems[i]);
}

for (var i = 0; i < elems.length - 1; ++i) {
    var minElemIdx = i;
    stage.setIdxs(i, i +1);
    stage.highlightGreen(i);
    for (var j = i + 1; j < elems.length; ++j) {
        if (j !== i + 1) {
            stage.setJ(j);
        }
        stage.highlight2(j, minElemIdx);
        if (elems[j] < elems[minElemIdx]) {
            stage.changeHighlightGreen(minElemIdx, j);
            minElemIdx = j;
        } else {
            stage.uh1g2(j, minElemIdx);
        }
    }
    if (minElemIdx != i) {
        stage.swap(i, minElemIdx);
        var tmp = elems[minElemIdx];
        elems[minElemIdx] = elems[i];
        elems[i] = tmp;
    }
    stage.dim(i);
}

stage.dim(i);

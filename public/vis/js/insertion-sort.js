var pointer1 = document.querySelector('#red-pointer');

var shortDuration = 500;
var longDuration = 1000;
var shortDelay = 500;
var longDelay = 1000;

function getBar(idx) {
    var elem = document.querySelector('#bar' + idx);
    if (elem == null) {
        throw new Error('getBar(' + idx + ') returned null!');
    }
    return elem;
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
    return new Promise(function (resolve, reject) {
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

function moveBarToIdx(barElem, idx) {
    return Velocity(barElem, {x: idx * 60}, longDuration);
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

stage.currentPromise = new Promise(function (resolve, reject) {
    stage.begin = resolve;
});

stage.setNext = function (actionFunc) {
    stage.nextFuncs.push(actionFunc);
}

stage.next = function (actionFunc) {
    stage.currentPromise = stage.currentPromise.then(stage.nextFuncs.shift());
}

stage.playAll = function () {
    stage.begin();
    while (stage.nextFuncs.length) {
        stage.next();
    }
}

stage.setI = function (i) {
    stage.setNext(() => {stage._i = i; return movePointer1ToIdx(i).delay(shortDelay)});
}

stage.elevateAndHightlightAndGiveTmpIdTo = function (idx, amount) {
    var id = 'tmp-id';
    stage.setNext(() => {
        var elem = getBar(idx);
        elem.id = id;
        return highlightBar(elem).then(() => moveBarUp(elem, amount)).delay(longDelay);
    });
    return id;
}

stage.lowerAndUnhighlightAndGiveBackId = function (curId, realIdx, amount) {
    stage.setNext(() => {
        var barElem = document.getElementById(curId);
        barElem.id = 'bar' + realIdx;
        return moveBarDown(barElem, amount).then(() => unhighlightBar(barElem)).delay(shortDelay);
    });
}

stage.moveBarToIdxAndAssignId = function (selector, newIdx) {
    stage.setNext(() => {
        var barElem;
        if (typeof selector === 'string') {
            barElem = document.getElementById(selector);
        } else {
            barElem = getBar(selector);
        }
        barElem.id = 'bar' + newIdx;
        return Velocity(barElem, {x: 60 * newIdx}, shortDuration).delay(shortDelay);
    });
}

stage.moveBarToIdxAndAssignIdAndLowerAndUnhighlight = function (selector, newIdx, amount) {
    stage.setNext(() => {
        var barElem;
        if (typeof selector === 'string') {
            barElem = document.getElementById(selector);
        } else {
            barElem = getBar(selector);
        }
        barElem.id = 'bar' + newIdx;
        return Velocity(barElem, {x: 60 * newIdx}, longDuration)
            .then(() => moveBarDown(barElem, amount))
            .then(() => unhighlightBar(barElem))
            .delay(shortDelay);
    });
}

var elems = [90, 150, 50, 90, 70, 30];

stage.elems = elems.slice();

for (var i = 0; i < stage.elems.length; i++) {
    getBar(i).setAttribute('height', stage.elems[i]);
}

for (var i = 1; i < elems.length; ++i) {
    stage.setI(i);
    var maxElem = elems[i - 1];
    for (var j = i - 1; j >= 0; --j) {
        if (elems[j] > maxElem) maxElem = elems[j];
    }
    var tmpId = stage.elevateAndHightlightAndGiveTmpIdTo(i, maxElem + 10);
    var k = i - 1;
    var tmp = elems[i];
    var entered = false;
    while (elems[k] > tmp && k >= 0) {
        entered = true;
        elems[k+1] = elems[k];
        stage.moveBarToIdxAndAssignId(k, k + 1);
        --k;
    }
    if (entered) {
        elems[k+1] = tmp;
        stage.moveBarToIdxAndAssignIdAndLowerAndUnhighlight(tmpId, k + 1, maxElem + 10);
    } else {
        stage.lowerAndUnhighlightAndGiveBackId(tmpId, i, maxElem + 10);
    }
}

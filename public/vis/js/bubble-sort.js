var pointer1 = document.querySelector('#green-pointer');
var pointer2 = document.querySelector('#red-pointer');

var commonDuration = 500;

function getBar(idx) {
    return document.querySelector('#bar' + idx);
}

function movePointer1ToIdx(idx) {
    return Velocity(pointer1, {
        translateX: 60 * idx,
        translateY: ['+=0', '-60']
    }, {
        duration: commonDuration,
    });
}

function movePointer2ToIdx(idx) {
    return Velocity(pointer2, {
        translateX: [60 * idx],
        translateY: ['+=0', '-60']
    }, {
        duration: commonDuration,
    });
}

function highlightBar(bar) {
    return Velocity(bar, {fill: '#ff9800'}, commonDuration);
}

function unhighlightBar(bar) {
    return Velocity(bar, {fill: '#057cb8'}, commonDuration);
}

function dimBar(bar) {
    return Velocity(bar, {fill: '#01334d'}, commonDuration);
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
            Velocity(bar1, {x: bar2.getBBox().x}),
            Velocity(bar2, {x: bar1.getBBox().x}),
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
    stepIdx: 0,
    nextFuncs: [],
};

stage.swap = function (i, j) {
    stage.setNext(() => {
        var tmp = stage.elems[i];
        stage.elems[i] = stage.elems[j];
        stage.elems[j] = tmp;
        return swapBars(i, j)
    });
},

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

stage.consider = function () {
    stage.setNext(
        () => Promise.all([
            highlightBar(getBar(stage._i)),
            highlightBar(getBar(stage._j))
        ]).delay(500)
    );
};

stage.moveOn = function (i, j) {
    stage.setNext(
        () => Promise.all([
            unhighlightBar(getBar(stage._i)),
            unhighlightBar(getBar(stage._j))
        ])
    );
};

stage.dim = function (idx) {
    stage.setNext(() => dimBar(getBar(idx)));
}

stage.setIdxs = function (i, j) {
    stage.setNext(() => {
        stage._i = i;
        stage._j = j;
        return Promise.all([
            movePointer1ToIdx(i),
            movePointer2ToIdx(j)
        ]);
    });
}

var elems = [90, 150, 50, 90, 70, 30];
Velocity.mock = 0.5;
stage.elems = elems.slice();

for (var i = 0; i < stage.elems.length; i++) {
    getBar(i).setAttribute('height', stage.elems[i]);
}

for (var limit = 0; limit < elems.length; ++limit) {
    for (var i = 1; i < elems.length - limit; ++i) {
        var j = i - 1;
        stage.setIdxs(i, j);
        stage.consider(i, j);
        if (elems[j] > elems[i]) {
            stage.swap(i, j);
            var tmp = elems[j];
            elems[j] = elems[i];
            elems[i] = tmp;
        }
        stage.moveOn(i, j);
    }
    stage.dim(elems.length - limit - 1);
}

import assert from 'assert';
import {
    checkMerged,
    connectStr,
    edgeStart,
    findNode,
    fixCFG,
    indexLastNode,
    removeExpection,
    removeLet
} from '../src/js/code-analyzer';
import * as esgraph from 'esgraph';
import * as esprima from 'esprima';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}\n';
        let graph = esgraph(esprima.parseScript(codeToParse, {range: true}).body[0].body);
        let dotVal = esgraph.dot(graph, {counter: 0, source: codeToParse});
        assert.equal(JSON.stringify('n1 [shape = rectangle label=" a = x + 1\n' +
            ' b = a + y\n' +
            ' c = 0"]\n' +
            '\n' +
            '\n' +
            'n4 [shape = diamond label="b < z"]\n' +
            'n5 [shape = rectangle label="c = c + 5"]\n' +
            'n6 [shape = rectangle label="return c"]\n' +
            'n7 [shape = diamond label="b < z * 2"]\n' +
            'n8 [shape = rectangle label="c = c + x + 5"]\n' +
            'n9 [shape = rectangle label="c = c + z + 5"]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 []\n' +
            'n4 -> n5 [label="true"]\n' +
            'n4 -> n7 [label="false"]\n' +
            'n5 -> n6 []\n' +
            'n7 -> n8 [label="true"]\n' +
            'n7 -> n9 [label="false"]\n' +
            'n8 -> n6 []\n' +
            'n9 -> n6 []\n'), JSON.stringify(fixCFG(dotVal)));
    });

    it('', ()=> {
        let index = 1;
        let fourthInd = 4;
        let mergedNodes = {1: [2, 3]};
        assert.equal(1, checkMerged(index, fourthInd, mergedNodes));
    });

    it('', ()=> {
        let temp = 'n1\n' + 'n1->n2';
        assert.equal('n1->n2', edgeStart(temp));
    });

    it('', ()=> {
        let nod = 'n2';
        let array = ['n1', 'n2'];
        assert.equal(findNode(array, nod), 1);
    });

    it('', ()=>{
        let index = 1;
        let fourthInd = 4;
        let mergedNodes = {5: [1, 3]};
        assert.equal(5, checkMerged(index, fourthInd, mergedNodes));
    });

    it('', ()=>{
        let code = 'n1';
        assert.equal(1, indexLastNode(code));
        code = 'n1\n' + 'n2';
        assert.equal(2, indexLastNode(code));
    });

    it('', ()=>{
        let code = 'let x = 3';
        assert.equal(JSON.stringify(' x = 3'), JSON.stringify(removeLet(code)));
        code = 'let x = 3\n let x = 2';
        assert.equal(JSON.stringify(' x = 3\n  x = 2'), JSON.stringify(removeLet(code)));
    });

    it('', ()=>{
        let arr = ['hi '];
        let start = 3;
        let index = 0;
        let toAdd = 'Or';
        connectStr(arr, index, start, toAdd);
        assert.equal(JSON.stringify(['hi Or']), JSON.stringify(arr));
    });

    it('', ()=>{
        let code = 'Checking unexpected argument';
        assert.equal(code, removeExpection(code));
        code = 'exception';
        assert.equal('', removeExpection(code));
    });
    it('', ()=>{
        let code = 'n9';
        assert.equal(0, indexLastNode(code));
        code = 'n432\n' + 'n2';
        assert.equal(0, indexLastNode(code));
    });
});
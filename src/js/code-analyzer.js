// // //import * as esprima from 'esprima';
// // // import * as escodegen from 'escodegen';
// // // import * as esgraph from 'esgraph';
// var esprima = require('esprima');
// // import * as safeEval from 'safe-eval';
// var escodegen = require('escodegen');
// var esgraph = require('esgraph');
// // let codeToParse = 'function foo(x, y, z){\n' +
// //     '   let a = x + 1;\n' +
// // //     '   let b = a + y;\n' +
// // //     '   let c = 0;\n' +
// // //     '   \n' +
// // //     '   while (a < z) {\n' +
// // //     '       c = a + b;\n' +
// // //     '       z = c * 2;\n' +
// // //     '       a++;\n' +
// // //     '   }\n' +
// // //     '   \n' +
// // //     '   return z;\n' +
// // //     '}\n';
// let codeToParse = 'function foo(x, y, z){\n' +
//     '    let a = x + 1;\n' +
//     '    let b = a + y;\n' +
//     '    let c = 0;\n' +
//     '    \n' +
//     '    if (b < z) {\n' +
//     '        c = c + 5;\n' +
//     '    } else if (b < z * 2) {\n' +
//     '        c = c + x + 5;\n' +
//     '    } else {\n' +
//     '        c = c + z + 5;\n' +
//     '    }\n' +
//     '    \n' +
//     '    return c;\n' +
//     '}\n';
//
// let graph = esgraph(esprima.parseScript(codeToParse, {range:true}).body[0].body);
// let dotVal = esgraph.dot(graph, { counter: 0, source: codeToParse});
// dotVal = fixCFG(dotVal);
// fixCFG(esgraph.dot(graph, { counter: 0, source: codeToParse}))
// console.log(dotVal);

function fixCFG(code){
    code = removeExpection(code);
    code = removeLet(code);
    let mergedNodes = {};
    let array = mergeNodes(code, mergedNodes);
    array = cleanNodes(array, mergedNodes);
    // array = addColor(array, args);
    code = addShape(array);
    return code;
}


function addShape(array){
    let indexes = Array.from(indexDiamond(array.join('\n')));
    let found = false;
    for(let i in array){
        if(i < array.length-1){
            if(array[i].indexOf('->')===-1){
                addSapePart2(array, i, indexes, found);
            }
        }}
    return array.join('\n');}

function addSapePart2(array, i, indexes, found){
    let start = array[i].indexOf('[')+1;
    for(let j = 0; j < indexes.length;j++)
    {
        if(array[i].indexOf(indexes[j])!==-1){
            connectStr(array, i, start, 'shape = diamond ');
            found = true;
        }
    }
    if(!found)
        connectStr(array, i, start, 'shape = rectangle ');
    found = false;
}

// function addColor(array, args){
//     let start = array[0].indexOf('[')+1;
//     connectStr(array, 0, start, 'color = green ');
//     let indexes = Array.from(indexSave(array.join('\n')));
//     for(let i in array){
//         if(i >= array.length-1)
//             break;
//         for(let j = 0; j < indexes.length;j++){
//             if(array[i].indexOf(indexes[j])!==-1)
//             {
//                 let str = replaceArgs(array[i], args);
//                 if(eval(str))
//                 {
//                     array[i].replace('[','[style="filled", color= "green",');
//                 }
//             }
//         }
//     }
//     return array;
// }

//
// function replaceArgs(nodeLabel, args){
//     for(let key in args){
//         if(nodeLabel.indexOf(key))
//             nodeLabel.replace(key, args[key]);
//     }
//     let startIdxNode = nodeLabel.indexOf('"')+1;
//     let subNode = nodeLabel.substr(startIdxNode, nodeLabel.length);
//     let endIdx = subNode.indexOf('"');
//     let nodeStr = subNode.substr(0, endIdx);
//     return nodeStr;
// }


function connectStr(array, index, start, toAdd){
    array[index] = array[index].substr(0, start) +
        toAdd + array[index].substr(start, array[index].length);
}
function removeExpection(code){
    let arrays = code.split('\n');
    let fixedArray = [];
    for(let i = 0; i < arrays.length; i++){
        if(arrays[i].indexOf('exception') === -1 &&
            arrays[i].indexOf('n' + indexLastNode(code)) === -1 && arrays[i].indexOf('n0'))
            fixedArray.push(arrays[i]);
    }
    return fixedArray.join('\n');
}
// function fixCFG(code){
//     let lastNodeIndex = indexLastNode(code);
//     return code.substring(0, lastNodeIndex);
// }

function indexLastNode(code){
    let val = 0;
    let counter = 1;
    while(val !== -1){
        val = code.indexOf('n'+counter);
        counter += 1;
    }
    return counter-2;
}

function removeLet(code){
    let array = code.split('\n');
    for(let i = 0; i < array.length; i++){
        array[i] = array[i].replace(';', '');
        if(array[i].indexOf('let') !== -1){
            array[i] = array[i].replace('let', '');
        }
    }
    return array.join('\n');
}

export {fixCFG, checkMerged, connectStr, edgeStart, addSapePart2, indexSave, findNode, removeIndxes,
    removeLet,indexLastNode, removeExpection};

function mergeNodes(code, mergedNodes){
    let array = code.split('\n');
    let found = false;
    let indexes = indexSave(code);
    indexes = Array.from(indexes);
    let edgeStartAt = edgeStart(code);
    let arrayEdges = edgeStartAt.split('\n');
    for(let i = 0; i < arrayEdges.length-1; i++){
        for(let j= 0; j<indexes.length; j++){
            if(arrayEdges[i].indexOf(indexes[j])!==-1) {
                found = true;
                break;
            }
        }
        if(!found)
            merge(arrayEdges[i], array, mergedNodes);
        found = false;
    }
    return array;
}

function edgeStart(code){
    let code2 = code.substr(code.indexOf('n1') + 1, code.length);
    return code2.substr(code2.indexOf('n1'), code2.length);
}

function merge(edge, array, mergedNodes){
    let indexes = findNodes(edge, array);
    //, node1Idx, node2Idx){
    let ind = checkMerged(indexes[0], indexes[1], mergedNodes);
    let node1 = array[ind];
    let node2 = array[indexes[1]];
    let startIdxNode2 = node2.indexOf('"')+1;
    let subNode2 = node2.substr(startIdxNode2, node2.length);
    let endIdx2 = subNode2.indexOf('"');
    let node2Str = subNode2.substr(0, endIdx2);
    let startIdxNode1 = node1.indexOf('"')+1;
    let subNode1 = node1.substr(startIdxNode1, node1.length);
    let endIdx1 = subNode1.indexOf('"');
    let node1Str = subNode1.substr(0, endIdx1);
    node1 = node1.replace(node1Str, node1Str +'\n' + node2Str);
    array[ind]= node1;

}

function indexDiamond(code){
    let array = code.split('\n');
    let indexes = new Set([]);
    for(let i = 0; i < array.length; i++){
        if(array[i].indexOf('true') !== -1 || array[i].indexOf('false') !== -1){
            findIndxDiamond(code, array[i], indexes);
        }
    }
    return indexes;
}

function indexSave(code){
    let array = code.split('\n');
    let indexes = new Set([]);
    for(let i = 0; i < array.length; i++){
        if(array[i].indexOf('true') !== -1 || array[i].indexOf('false') !== -1){
            findIndx(code, array[i], indexes);
        }
    }
    return indexes;
}

function findIndx(code, str, indexes){
    let counter = 0;
    let idx = -1;
    while(counter <= indexLastNode(code)+1){
        idx = str.indexOf('n'+counter);
        if(idx !==  -1)
            indexes.add('n'+counter);
        counter +=1;
    }
}
function findIndxDiamond(code, str, indexes){
    let counter = 0;
    let idx = -1;
    str = str.substr(0, str.indexOf('->'));
    while(counter <= indexLastNode(code)+1){
        idx = str.indexOf('n'+counter);
        if(idx !==  -1)
            indexes.add('n'+counter);
        counter +=1;
    }
}


function findNode(array, node){
    for(let i = 0; i < array.length; i++){
        if(array[i].indexOf(node)!==-1)
            return i;
    }
}


function findNodes(edge, array){
    let counter = 1;
    let firstIdx = -1;
    let secIdx = -1;
    let foundOne = false;
    let code = array.join('\n');
    while(counter <= indexLastNode(code)+1){
        if(edge.indexOf('n'+counter)!==-1)
            if(foundOne){
                secIdx = findNode(array, 'n'+counter);
                break;
            }
            else {
                firstIdx = findNode(array, 'n'+counter);
                foundOne = true;
            }
        counter += 1;
    }
    return [firstIdx, secIdx];
}

function checkMerged(index1, index2, mergedNodes){
    for(let key in mergedNodes){
        let merged = mergedNodes[key];
        for(let i = 0; i < merged.length; i++){
            if(merged[i] === index1){
                mergedNodes[key].push(index2);
                return key;
            }
        }
    }
    if(mergedNodes[index1] !== undefined)
        mergedNodes[index1].push(index2);
    else
        mergedNodes[index1] = [index2];
    return index1;
}


function removeIndxes(array, mergedNodes){
    let indexes = new Set([]);
    for(let i = 0; i < array.length; i++){
        for(let key in mergedNodes){
            let merged = mergedNodes[key];
            for(let j = 0; j < merged.length; j++)
            {
                if(merged[j] === i)
                    indexes.add(i);
            }
        }
    }
    return indexes;
}

function cleanNodes(array, mergedNodes){
    let ans = [];
    let indexes = removeIndxes(array, mergedNodes);
    for(let i = 0; i < array.length; i++){
        if(! indexes.has(i)){
            ans[i] = array[i];
        }
    }
    return ans;
}

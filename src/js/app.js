import $ from 'jquery';
//import {parseCode} from './code-analyzer';
// import {createCFG} from './code-analyzer';
import Viz from 'viz.js';
import * as esgraph from 'esgraph';
import * as esprima from 'esprima';
import {fixCFG} from './code-analyzer';
import {Module, render} from 'viz.js/full.render.js';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        // let args = JSON.parse($('#params').val());
        let graph = esgraph(esprima.parseScript(codeToParse, {range:true}).body[0].body);
        let dotVal = esgraph.dot(graph, { counter: 0, source: codeToParse});
        // dotVal = fixCFG(dotVal, args);
        dotVal = fixCFG(dotVal);
        // let dotVal = changeCFG(dotVal);
        let svg = new Viz ({Module, render});
        svg.renderSVGElement('digraph{'+ dotVal + '}').then(function(element){
            $('#parsedCode').html(element);
        });
    });
});

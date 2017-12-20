<template>
    <div>
        <svg/>
    </div>
</template>
<script>
import d3 from 'd4'

let data = {
    "name": "产品质量",
    "children": [{
            "name": "人",
            "children": [{
                    "name": "新人培训"
                },
                {
                    "name": "产品意识淡薄"
                },
                {
                    "name": "培训次数减少"
                }
            ]
        },
        {
            "name": "机",
            "children": [
                {
                    "name": "老化"
                }
            ]
        },
        {
            "name": "物",
            "children": [{
                    "name": "胶件材料不良",
                    "children": [
                        {
                            "name": "材料变形"
                        }
                    ]
                }
            ]
        },
        {
            "name": "法",
            "children": [{
                    "name": "检验手段不标准",
                    "children": [
                        {
                            "name": "未采用先进检测手段"
                        }
                    ]
                }]
        },
        {
            "name": "环",
            "children": [{
                "name": "场所温度高"
            }]
        }
    ]
}

export default {
    data () {
        return {

        }
    },
    mounted () {
        (function(d3){
            "use strict";
            d3.fishbone = function(){
                /*
                A Fishbone diagram implemented in d3.
                */

                // private variables
                var _margin = 50,

                // the data...
                _nodes,
                _links;

                // d3 selections and related things used in tick function
                var _node,
                _link,
                _root,
                _arrowId = function(d){ return "arrow"; },

                // the children accessor
                _children = function(d){ return d.children; },

                // the label accessor
                _label = function(d){ return d.name; },

                // a custom tick accessor
                _perNodeTick = function(d){},


                // arbitrary "nice" values
                _linkScale = d3.scale.log()
                    .domain([1, 5])
                    .range([60, 30]),

                // the main workhorse of the layout engine
                _force = d3.layout.force()
                    .gravity(0)
                    .size([
                    window.document.documentElement.clientWidth,
                    window.document.documentElement.clientHeight
                    ])
                    .linkDistance(_linkDistance)
                    .chargeDistance([10])
                    .on("tick", _tick);

                var fb1 = function($){
                /*
                    the d3.fishbone modifier, expecting to be called against an `svg:svg`
                    or `svg:g` bound to the root node of a navigable tree, i.e.

                    d3.select("body").append("svg")
                        .datum({name: "foo", children: [{name: "bar"}]})
                        .call(d3.fishbone());

                    in addition to the properties created by `d3.layout.force`, this will
                    add some or all of the following properties, none of which are
                    guaranteed to be stable, useful, or sane:

                    - depth       int
                    - horizontal  bool
                    - vertical    bool
                    - root        bool
                    - childIdx    int
                    - maxChildIdx bool
                    - totalLinks  [int]
                    - linkCount   int
                */
                
                _links = [];
                _nodes = [];

                // populate the nodes and the links globals as a side effect
                _build_nodes($.datum());

                // set the nodes and the links of the force
                _force
                    .nodes(_nodes)
                    .links(_links);

                // create the links
                _link = $.selectAll(".link")
                    .data(_links);

                _link.enter().append("line");
                
                _link
                    .attr({
                    "class": function(d){ return "link link-" + d.depth; },
                    "marker-end": function(d){
                        return d.arrow ? "url(#" + _arrowId(d) + ")" : null;
                    }
                    });
                
                _link.exit().remove();

                // establish the node selection
                _node = $.selectAll(".node").data(_nodes);


                // actually create nodes
                _node.enter().append("g")
                    .attr({
                    "class": function(d){ return "node" + (d.root ? " root" : ""); }
                    })
                    .append("text");

                _node.select("text")
                    .attr({
                    "class": function(d){ return "label-" + d.depth; },
                    "text-anchor": function(d){
                        return !d.depth ? "start" : d.horizontal ? "end" : "middle";
                    },
                    dy: function(d){
                        return d.horizontal ? ".35em" : d.region === 1 ? "1em" : "-.2em";
                    }
                    })
                    .text(_label);

                _node.exit().remove();

                // set up node events
                _node
                    .call(_force.drag)
                    .on("mousedown", function(){ d3.event.stopPropagation(); });

                // select this so we know its width in tick
                _root = $.select(".root").node();
                }; // fb1


                function _arrow($){
                // creates an svg:defs and marker with an arrow if needed...
                // really just an example, as they aren't very flexible
                var defs = $.selectAll("defs").data([1]);

                defs.enter().append("defs");

                // create the arrows
                defs.selectAll("marker#" + _arrowId())
                    .data([1])
                .enter().append("marker")
                    .attr({
                    id: _arrowId(),
                    viewBox: "0 -5 10 10",
                    refX: 10,
                    refY: 0,
                    markerWidth: 10,
                    markerHeight: 10,
                    orient: "auto"
                    })
                .append("path")
                    .attr({d: "M0,-5L10,0L0,5"});
                }

                function _build_nodes(node){
                /*
                    this builds up the real/fake nodes and links needed
                    - a node on the "spine" can be like:
                    - o--->

                        |
                    - o-+->

                        |
                    - o-+->
                        |

                    - a node off a "rib" or "subrib" can be like:

                    - o--->

                        \
                    - o--->

                */
                _nodes.push(node);

                var cx = 0;

                var between = [node, node.connector],
                    nodeLinks = [{
                    source: node,
                    target: node.connector,
                    arrow: true,
                    depth: node.depth || 0
                    }],
                    prev,
                    childLinkCount;

                if(!node.parent){
                    _nodes.push(prev = {tail: true});
                    between = [prev, node];
                    nodeLinks[0].source = prev;
                    nodeLinks[0].target = node;
                    node.horizontal = true;
                    node.vertical = false;
                    node.depth = 0;
                    node.root = true;
                    node.totalLinks = []
                }else{
                    node.connector.maxChildIdx = 0;
                    node.connector.totalLinks = [];
                }

                node.linkCount = 1;

                (_children(node) || []).forEach(function(child, idx){
                    child.parent = node;
                    child.depth = (node.depth || 0) + 1;
                    child.childIdx = idx;
                    child.region = node.region ? node.region : (idx & 1 ? 1 : -1);
                    child.horizontal = !node.horizontal;
                    child.vertical = !node.vertical;

                    if(node.root && prev && !prev.tail){
                    _nodes.push(child.connector = {
                        between: between,
                        childIdx: prev.childIdx
                    })
                    prev = null;
                    }else{
                    _nodes.push(prev = child.connector = {between: between, childIdx: cx++});
                    }

                    nodeLinks.push({
                    source: child,
                    target: child.connector,
                    depth: child.depth
                    });

                    // recurse capturing number of links created
                    childLinkCount = _build_nodes(child);
                    node.linkCount += childLinkCount;
                    between[1].totalLinks.push(childLinkCount);
                });

                between[1].maxChildIdx = cx;

                Array.prototype.unshift.apply(_links, nodeLinks);

                // the number of links created byt this node and its children...
                // TODO: use `linkCount` and/instead of `childIdx` for spacing
                return node.linkCount;
                }


                function _linePosition($){
                $.attr({
                    x1: function(d){ return d.source.x; },
                    y1: function(d){ return d.source.y; },
                    x2: function(d){ return d.target.x; },
                    y2: function(d){ return d.target.y; }
                })
                }


                function _nodePosition($){
                // uses an SVG `transform` to position nodes
                $.attr("transform", function(d){
                    return "translate(" + d.x + "," + d.y + ")";
                })
                }


                function _linkDistance(d){
                // make longer links for nodes with more children, or of lower depth
                return (d.target.maxChildIdx + 1) * _linkScale(d.depth + 1);
                }


                function _tick(e){
                /*
                    the primary layout mechanism: a fair amount of the work is done
                    by links, but override a lot of it here.

                    TODO: enable tweaks to these individual rules
                */

                // this is a "little bit"
                var k = 6 * e.alpha,
                    // cache some variables
                    size = _force.size(),
                    width = size[0],
                    height = size[1],
                    // scratch variables for lengthy expressions
                    a,
                    b;

                _nodes.forEach(function(d){
                    // handle the middle... could probably store the root width...
                    if(d.root){ d.x = width - (_margin + _root.getBBox().width); }
                    if(d.tail){ d.x = _margin; d.y = height / 2; }

                    // put the first-generation items at the top and bottom
                    if(d.depth === 1){
                    d.y = d.region === -1 ? _margin : (height - _margin);
                    d.x -= 10 * k;
                    }

                    // vertically-oriented tend towards the top and bottom of the page
                    if(d.vertical){ d.y += k * d.region; }

                    // everything tends to the left
                    if(d.depth){ d.x -= k; }

                    // position synthetic nodes at evently-spaced intervals...
                    // TODO: do something based on the calculated size of each branch
                    // since we don't have individual links anymore
                    if(d.between){
                    a = d.between[0];
                    b = d.between[1];

                    d.x = b.x - (1 + d.childIdx) * (b.x - a.x) / (b.maxChildIdx + 1);
                    d.y = b.y - (1 + d.childIdx) * (b.y - a.y) / (b.maxChildIdx + 1);
                    }

                    _perNodeTick(d);
                });

                // actually apply all changes
                _node.call(_nodePosition);
                _link.call(_linePosition);
                }

                // the d3.fishbone() public API
                // read-only
                fb1.links = function(){ return _links; };
                fb1.nodes = function(){ return _nodes; };
                fb1.force = function(){ return _force; };

                // callable
                fb1.defaultArrow = _arrow;

                // d3-style chainable
                fb1.margin = function(_){
                // how big is the whitespace around the diagram?
                if(!arguments.length){ return _margin; }
                _margin = _;
                return my;
                };

                fb1.children = function(_){
                // how  will children be sought from each node?
                if(!arguments.length){ return _children; }
                _children = _;
                return my;
                };

                fb1.label = function(_){
                // how will a label be sought from each node?
                if(!arguments.length){ return _label; }
                _label = _;
                return my;
                };

                fb1.perNodeTick = function(_){
                // what custom rules should be done per node?
                if(!arguments.length){ return _perNodeTick; }
                _perNodeTick = _;
                return my;
                };

                return fb1;
            }; // d3.fishbone
        }).call(this, d3)
        // create the configurable selection modifier
        var fishbone = d3.fishbone();
      
        // the most reliable way to get the screen size
        var size = (function(){
            return {width: this.clientWidth, height: this.clientHeight};
            }).bind(window.document.documentElement),
        
        svg = d3.select(this.$el)
                .select('svg')
            // firefox needs a real size
            .attr(size())
            // set the data so the reusable chart can find it
            .datum(data)
            // set up the default arrowhead
            .call(fishbone.defaultArrow)
            // call the selection modifier
            .call(fishbone);
            
        // this is the actual `force`: just start it
        fishbone.force().start();
        
        // handle resizing the window
        d3.select(window).on("resize", function(){
            fishbone.force()
            .size([size().width, size().height])
            .start();
            svg.attr(size())
        });
    }
}
</script>
<style>
.label-0{ font-size: 2em; }
.label-1{ font-size: 1.5em; fill: #111; }
.label-2{ font-size: 1em; fill: #444; }
.label-3{ font-size: .9em; fill: #888; }
.label-4{ font-size: .8em; fill: #aaa; }

.link-0{ stroke: #000; stroke-width: 2px}
.link-1{ stroke: #333; stroke-width: 1px}
.link-2, .link-3, .link-4{ stroke: #666; stroke-width: .5px; }
</style>

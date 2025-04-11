/**
 * Date : 2025-03-25
 * By   : yinlianhua@sina.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let ejs    = require("ejs");

const fn_make_fund_ejs_v1 = async (data=[]) => {
    let head = `
    <html xmlns = "http://www.w3.org/1999/xhtml">
        <head>
            <style>
                body {
                    -webkit-font-smoothing: antialiased;
                    font-family: Helvetica, 'Hiragino Sans GB', 'Microsoft Yahei', '微软雅黑', Arial, sans-serif;
                    font-size: 12px;
                    background-color: #F5F5F5;
                    padding: 40px;
                }
    
                table {
                    width: 100%;
                    background-color: transparent;
                    border-collapse: collapse;
                    border-spacing: 0;
                    boxing-size: border-box;
                    display: table;
                    border-color: gray;
                }
    
                table th {
                    vertical-align: bottom;
                    border-bottom: 2px solid #dddddd;
                    padding: 8px;
                    text-align: left;
                    border-color: gray;
                }
    
                tbody {
                    box-sizing: border-box;
                    border-collapse: collapse;
                    border-spacing: 0;
                }
    
                table tr {
                    box-sizing:
                    border-box;
                }
    
                table tr th {
                    text-align: right;
                }
    
                td {
                    padding: 8px;
                    vertival-align: top;
                    border-top: 1px solid #dddddd;
                    text-align: right;
                }
    
                tbody > tr:nth-child(odd) > td {background-color: #f9f9f9;}
    
                tbody > tr:hover > td {
                    background-color: #f5f5f5;
                }
    
                .well {
                    background-color: #f5f5f5;
                    border: 1px solid #e3e3e3;
                    border-radius: 4px;
                    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .05);
                    margin-top: 15px;
                    padding: 19px;
                    box-sizing: border-box;
                }
    
                .well {
                    padding-right: 15px;
                    padding-left: 15px;
                }
    
                .col-xs-6 {
                    position: relative;
                    color: #788188;
                }
    
                .invoices caption {text-align: left}
    
                .axis path,.x.axis path {display: none;}
    
                .line {
                    fill: none;
                    stroke: steelblue;
                    stroke-width: 1.5px;
                }
    
                .node {
                    stroke: #fff;
                    stroke-width: 1.5px;
                }
    
                .grid .tick {
                    stroke: lightgrey;
                    opacity: 0.7;
                }
    
                .grid path {stroke-width: 0;}
    
                #tips h5 {color: rgb(255,0,0);}
                #org_name {
                    padding:5px;
                    margin-top:20px;
                }
                #org_name span {
                    background-color:rgb(52, 152, 219);
                    color:white;
                    font-size:20px;
                }
            </style>
        </head>
        <body>
    `;
    
    let tail = `
            <br/>
        </body>
    </html>`;

    // <th>基金代码</th>
    let ctx = `
<table id="state">
    <thead>
        <tr>
            <th width="5%">日期</th>
            <th width="15%">名称</th>
            <th width="5%">净值</th>
            <th width="5%">得分</th>
            <th width="5%">MA010</th>
            <th width="5%">MA020</th>
            <th width="5%">MA030</th>
            <th width="5%">MA060</th>
            <th width="5%">MA090</th>
            <th width="5%">MA120</th>
            <th width="10%">区间-030</th>
            <th width="10%">区间-060</th>
            <th width="10%">区间-090</th>
            <th width="10%">区间-120</th>
        </tr>
    </thead>
    <tbody>
    <% for (let i of data) { %>
        <tr>
            <td><%= i.date %></td>
            <td style="color:<%= i.c_name %>">&nbsp;<%= i.name %>&nbsp;</td>
            <td style="color:<%= i.c_latest %>">&nbsp;<%= i.latest %>&nbsp;</td>
            <td style="color:<%= i.c_score %>">&nbsp;<%= i.score %>&nbsp;</td>
            <td style="color:<%= i.c_avg010 %>">&nbsp;<%= i.avg010 %>&nbsp;</td>
            <td style="color:<%= i.c_avg020 %>">&nbsp;<%= i.avg020 %>&nbsp;</td>
            <td style="color:<%= i.c_avg030 %>">&nbsp;<%= i.avg030 %>&nbsp;</td>
            <td style="color:<%= i.c_avg060 %>">&nbsp;<%= i.avg060 %>&nbsp;</td>
            <td style="color:<%= i.c_avg090 %>">&nbsp;<%= i.avg090 %>&nbsp;</td>
            <td style="color:<%= i.c_avg120 %>">&nbsp;<%= i.avg120 %>&nbsp;</td>
            <td style="color:<%= i.c_030 %>">&nbsp;<%= i.min030 %> ~ <%= i.max030 %> <%= i.s_030 %>&nbsp;</td>
            <td style="color:<%= i.c_060 %>">&nbsp;<%= i.min060 %> ~ <%= i.max060 %> <%= i.s_060 %>&nbsp;</td>
            <td style="color:<%= i.c_090 %>">&nbsp;<%= i.min090 %> ~ <%= i.max090 %> <%= i.s_090 %>&nbsp;</td>
            <td style="color:<%= i.c_120 %>">&nbsp;<%= i.min120 %> ~ <%= i.max120 %> <%= i.s_120 %>&nbsp;</td>
        </tr>
    <% } %>
    </tbody>
</table>
`;
    let ctx_back = `
<table id="state">
    <thead>
        <tr>
            <th>日期</th>
            <th>名称</th>
            <th>净值</th>
            <th>得分</th>
            <th>MA010</th>
            <th>MA020</th>
            <th>MA030</th>
            <th>MA060</th>
            <th>MA090</th>
            <th>MA120</th>
            <th>MA150</th>
            <th>MA180</th>
            <th>MA210</th>
            <th>区间-030</th>
            <th>区间-060</th>
            <th>区间-090</th>
            <th>区间-120</th>
            <th>区间-150</th>
            <th>区间-180</th>
            <th>区间-210</th>
        </tr>
    </thead>
    <tbody>
    <% for (let i of data) { %>
        <tr>
            <td><%= i.date %></td>
            <td style="color:<%= i.c_name %>"><%= i.name %></td>
            <td style="color:<%= i.c_latest %>"><%= i.latest %></td>
            <td style="color:<%= i.c_score %>"><%= i.score %></td>
            <td style="color:<%= i.c_avg010 %>"><%= i.avg010 %></td>
            <td style="color:<%= i.c_avg020 %>"><%= i.avg020 %></td>
            <td style="color:<%= i.c_avg030 %>"><%= i.avg030 %></td>
            <td style="color:<%= i.c_avg060 %>"><%= i.avg060 %></td>
            <td style="color:<%= i.c_avg090 %>"><%= i.avg090 %></td>
            <td style="color:<%= i.c_avg120 %>"><%= i.avg120 %></td>
            <td style="color:<%= i.c_avg150 %>"><%= i.avg150 %></td>
            <td style="color:<%= i.c_avg180 %>"><%= i.avg180 %></td>
            <td style="color:<%= i.c_avg210 %>"><%= i.avg210 %></td>
            <td style="color:<%= i.c_030 %>"><%= i.min030 %> ~ <%= i.max030 %> <%= i.s_030 %></td>
            <td style="color:<%= i.c_060 %>"><%= i.min060 %> ~ <%= i.max060 %> <%= i.s_060 %></td>
            <td style="color:<%= i.c_090 %>"><%= i.min090 %> ~ <%= i.max090 %> <%= i.s_090 %></td>
            <td style="color:<%= i.c_120 %>"><%= i.min120 %> ~ <%= i.max120 %> <%= i.s_120 %></td>
            <td style="color:<%= i.c_150 %>"><%= i.min150 %> ~ <%= i.max150 %> <%= i.s_150 %></td>
            <td style="color:<%= i.c_180 %>"><%= i.min180 %> ~ <%= i.max180 %> <%= i.s_180 %></td>
            <td style="color:<%= i.c_210 %>"><%= i.min210 %> ~ <%= i.max210 %> <%= i.s_210 %></td>
        </tr>
    <% } %>
    </tbody>
</table>
`;

    let template = `${head}${ctx}${tail}`.toString();

    return ejs.render(template, {"data" : data});
};

module.exports = fn_make_fund_ejs_v1;

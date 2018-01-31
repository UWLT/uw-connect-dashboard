var socket = io();
$(document).ready(function(){
  setInterval(function(){refreshTicket()}, 10000);
});

function refreshTicket(){
  socket.emit('pingticket', 'RefreshTickets!');
}
socket.on('ticketRefresh', function(data){
  // $('.canvasRequest').empty();
  // $('#lmscount').empty().append("Ticket #:" + body.lms.length);
  // data.lms.forEach(function(req){
  //   $('.canvasRequest').append(
  //     "<tr><th>" + req.number + "</th>" +
  //     "<th>"+ req.state +"</th>" +
  //     "<th>"+ req.description.substring(0,20) + "...</th>" +
  //     "<th>"+ req.sys_updated_on +"</th></tr>");
  // });
  // $('.multimediaRequest').empty();
  // $('#multcount').empty().append("Ticket #:" + body.multimedia.length);
  // data.multimedia.forEach(function(req){
  //   $('.multimediaRequest').append(
  //     "<tr><th>" + req.number + "</th>" +
  //     "<th>"+ req.state +"</th>" +
  //     "<th>"+ req.description.substring(0,20) +"...</th>" +
  //     "<th>"+ req.sys_updated_on +"</th></tr>");
  // });
  // $('.pollevRequest').empty();
  // $('#pollcount').empty().append("Ticket #:" + body.pollev.length);
  // data.pollev.forEach(function(req){
  //   $('.pollevRequest').append(
  //     "<tr><th>" + req.number + "</th>" +
  //     "<th>"+ req.state +"</th>" +
  //     "<th>"+ req.description.substring(0,20) +"...</th>" +
  //     "<th>"+ req.sys_updated_on +"</th></tr>");
  // });
})

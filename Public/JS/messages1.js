$(document).ready(function() {
    $.get("/getProposals", function(proposaldata) {
        display(JSON.parse(proposaldata))
    });

    function display(players) {
        var list = "";
        console.log(players);
        for (var i = 0; i < players.length; i++) {
            var acceptor = "Open";
            var action = "Accept";
            var status = "Pending";
            var classToUse = "notAccepted"
            if (players[i].acceptedby_id) {
                acceptor = players[i].acceptedby_id.first_name;
                action = `<a href="/showMatch/${players[i].proposal_id}"  id=${players[i].proposal_id}>Match</a>`;
                classToUse = "Accepted"
            }
            if (players[i].status) { status = "Accepted" }

            list = list + '<tr>' +
                ' <td>' + players[i]['proposer_id']['first_name'] +
                '<td> ' + players[i].phone + '</td>' +
                ' <td>' + players[i].day.slice(5, 10).replace('-', '/') + '<td>' + players[i].timestamp +
                ' <td>' + players[i].location + ' <td id="status' + players[i].proposal_id + '">' + status +
                '<td id="acceptor' + players[i].proposal_id + '">' +
                acceptor + '</td>' +
                +'<td>' + players[i].email +
                '<td id="cell' + players[i].proposal_id + '">' + '<button class="' + classToUse + '" id="' + players[i].proposal_id +
                '" type="  button ">' + action + '</button>' +
                '</tr>';
        }
        $(".players_table").append(list);


        $(".notAccepted").click(function() {
            var pid = $(this).attr("id");
            var self = this;
            console.log("pid is ", pid);
            $.post("/acceptProposal", { "id": pid }, function(result) {
                //console.log(result);
                if (result) {
                    $('#acceptor' + pid).html(result)
                    $('#status' + pid).html("Accepted")
                    $(self).html('<a href="/showMatch/' + pid + '"  id=' + pid + '>Match</a>')
                    $(self).addClass("Accepted");
                    $(self).removeClass("notAccepted");

                }
                //window.location.replace('/messages.html')
            });
        });
    }
});

 $(document).ready(function() {


     var urlParams = new URLSearchParams(window.location.search);
     var pid = urlParams.get('id');
     console.log(pid);
     var myObj, x, y;


     $.post("/enterScores ", {
         "id": pid
     }, function(result) {
         var myObj = JSON.parse(result)
         console.log(myObj, typeof(myObj));
         x = myObj['proposer']['first_name'];
         y = myObj.acceptedby.first_name;
         console.log(x, y);


         $("#label1").append(x);
         $("#label2").append(y);

         if (result) {

             //console.log("success ");


         }
         else {
             console.log("failure ");
         }
     });


     $(".btn-primary ").click(function() {


         var x = {
             proposer_id: myObj.proposer.profile_id,
             acceptedby_id: myObj.acceptedby.profile_id,
             scores: [
                 [$("#score1").val(), $("#score4").val()],
                 [$("#score2").val(), $("#score5").val()],
                 [$("#score3").val(), $("#score6").val()]
             ],
             proposal_id: pid
         }

         console.log("calculated x is ", x)

         $.post("/addScores ", x, function(result) {
             console.log(result);
             if (result) {

                 console.log("success", result);



             }
             else {
                 console.log("failure ");
             }

         });

     });

 });
 
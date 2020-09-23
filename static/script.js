
const $submitForm = $("#word-submit");
let total = 0;
let i = 0;
const words = new Set();
const messages = ["Good Job!!!", "Excellent!!!", "Superb!!!"];
move();
$submitForm.on('submit', async function(e){
    e.preventDefault();
    const word = $("input#word").val();
    console.log(word);
    const resp = await axios.get(`${window.origin}/check_valid_word`, { params: { word:word.toLowerCase()}});
    if(resp.data.result==="ok"){
        if(words.has(word)){
          toggleMessage("You entered this word already...");
          $("td.box").removeClass(".box");
        } else{
          words.add(word);
          total += word.length;
          $("h3#total").text(`${total}`);
          $("h3#word_score").text(`${word.length}`);
          toggleMessage(messages[Math.floor(Math.random()*messages.length)])
          removeClass();
        }
    } else {
        toggleMessage(resp.data.result);
    }
});

function move() {
  if (i == 0) {
    i = 1;
    var elem = $("#myBar");
    var width = 1;
    var id = setInterval(frame, 600);
    async function frame() {
      if (width >= 100) {
        clearInterval(id);
        i = 0;
        $("h3#timesup").text("Game is over");
        $('input[type="text"]').prop('disabled', true);
        $('button[type="submit"]').prop('disabled', true);
        const response = await axios.post(`${window.origin}/post_data`,
            {total: total}
         );
        $("h3#highest").text(response.data.total);
        $("h3#game_number").text(response.data.number);
        $("#messages").addClass("alert alert-warning").show();
        $("#messages").text("Time is up...");
        $("input#word.form-control").val("");
        //show restart button when game is over
        $('#exampleModal').modal('show');
      } else {
        width++;
        elem.width(width + "%").attr('aria-valuenow', width);
      }
    }
  }
}

// /*message will disappear after few seconds*/
function toggleMessage(message){
  $("#messages").addClass("alert alert-warning").show();
  $("#messages").text(message);
  $("#messages").delay(2000).slideUp(300);
  $("input#word.form-control").val("");
}

$("td").on('click',function(){
  $(this).addClass("box");
  if($("input#word.form-control").val()!==''){
    $("input#word.form-control").val($("input#word.form-control").val() + $(this).text())
  }else{
    $("input#word.form-control").val($(this).text())
  }
  console.log($("input#word.form-control").val());
});

function removeClass() {
  const cells = Array.from(document.querySelectorAll('tr td.box'));
  console.log(cells);
  cells.forEach(cell => {
    cell.classList.remove('box');
  });
}
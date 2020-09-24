
let total = 0,
    i = 0;
const words = new Set(),
      messages = ["Good Job!!!", "Excellent!!!", "Superb!!!"],
      $submitForm = $("#word-submit");

//Start Timer
move();

$submitForm.on('submit', async function(e){
    await submitWord(e);
});

/*cell handler*/
$("td").on('click',handleCells);

/*Message will disappear after few seconds*/
function toggleMessage(message){
  $("#messages").addClass("alert alert-warning").show();
  $("#messages").text(message);
  $("#messages").delay(2000).slideUp(300);
  $("input#word.form-control").val("");
  removeClass();
}

/* Remove class box from the Game*/
function removeClass() {
  const cells = Array.from(document.querySelectorAll('tr td.box'));
  console.log(cells);
  cells.forEach(cell => {
    cell.classList.remove('box');
  });
}

/* Timeset for a Game N */
function move() {
  if (i == 0) {
    i = 1;
    let elem = $("#myBar"),
        width = 1,
        id = setInterval(frame, 600);
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

/* Clicking on cells will add letters to the input*/
function handleCells(){
  if($("input#word.form-control").val()!=='' && !$(this).hasClass("box")){
    $(this).addClass("box");
    $("input#word.form-control").val($("input#word.form-control").val() + $(this).text())
  }else if($("input#word.form-control").val()==='' && !$(this).hasClass("box")){
    $(this).addClass("box");
    $("input#word.form-control").val($(this).text())
  } else if($(this).hasClass("box")){
    removeClass();
    $("input#word.form-control").val()
  }
}

/* Checking for word if valid and send request to the server*/
async function submitWord(e){
  e.preventDefault();
  const word = $("input#word").val().toLowerCase();
  const boardDim = $("table").data('id');
  const resp = await axios.get(`${window.origin}/${boardDim}/check_valid_word`, { params: { word}});
  if(resp.data.result==="ok"){
      if(words.has(word)){
        toggleMessage("You entered this word already...");
      } else{
        words.add(word);
        total += word.length;
        $("h3#total").text(`${total}`);
        $("h3#word_score").text(`${word.length}`);
        toggleMessage(messages[Math.floor(Math.random()*messages.length)])
      }
  } else {
      toggleMessage(resp.data.result);
  }
}

const $submitForm = $("#word-submit");
let total = 0;
let i = 0;

move();
$submitForm.on('submit', async function(e){
    e.preventDefault();
    const word = $("input#word").val();
    console.log(word);
    const resp = await axios.get(`${window.origin}/check_valid_word`, { params: { word }});
    if(resp.data.result==="ok"){
        total += word.length;
        $("h3#total").text(`${total}`);
        $("h3#word_score").text(`${word.length}`);
        $("h3#messages").text(resp.data.result);
    } else {
        $("h3#messages").text(resp.data.result);
    }
});

function move() {
  if (i == 0) {
    i = 1;
    var elem = $("#myBar");
    var width = 1;
    var id = setInterval(frame, 600);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        i = 0;
        $("h3#timesup").text("Game is over");
        $('input[type="text"]').prop('disabled', true);
        $('button[type="submit"]').prop('disabled', true);
      } else {
        width++;
        // elem.css("width",`${width}px`);
        elem.width(width + "%").attr('aria-valuenow', width);
      }
    }
  }
}
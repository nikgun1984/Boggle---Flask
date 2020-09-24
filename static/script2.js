class BoggleGameUtility{
    constructor(){
        this.total = 0;
        this.words = new Set();
        this.messages = ["Good Job!!!", "Excellent!!!", "Superb!!!"];
    }
    
    /* Toggle between CSS class to remove or add border to the cell*/
    removeClass() {
        const cells = Array.from(document.querySelectorAll('tr td.box'));
        cells.forEach(cell => {
          cell.classList.remove('box');
        });
        $("input#word.form-control").val("");
    }
    
    /* Add messages on Success/Failure Word Submissions*/
    toggleMessage(message){
        $("#messages").addClass("alert alert-warning").show();
        $("#messages").text(message);
        $("#messages").delay(2000).slideUp(300);
        this.removeClass();
    }
    
    /* Timer bar/Send Request to the Server on total scores for comparison*/
    move() {
        let width = 0,
            id = setInterval(frame.bind(this), 600);
        async function frame() {
          if (width >= 100) {
                clearInterval(id);
                $("h3#timesup").text("Game is over");
                $('input[type="text"]').prop('disabled', true);
                $('button[type="submit"]').prop('disabled', true);
                const response = await axios.post(`${window.origin}/post_data`, {total:this.total});
                $("h3#highest").text(response.data.total);
                $("h3#game_number").text(response.data.number);
                $("#messages").addClass("alert alert-warning").show();
                $("#messages").text("Time is up...");
                $("input#word.form-control").val("");
                //show restart button when game is over
                $('#exampleModal').modal('show');
            } else {
                width++;
                $("#myBar").width(width + "%").attr('aria-valuenow', width);
            }
        }
    }

    /* Handle Cells by adding CSS to the cell*/
    handleCells(){
        if($("input#word.form-control").val()!=='' && !$(this).hasClass("box")){
          $(this).addClass("box");
          $("input#word.form-control").val($("input#word.form-control").val() + $(this).text())
        }else if($("input#word.form-control").val()==='' && !$(this).hasClass("box")){
          $(this).addClass("box");
          $("input#word.form-control").val($(this).text())
        } else if($(this).hasClass("box")){
          this.removeClass();
        }
    }

    /* Send typed/clicked words to the Server to verify*/
    async submitWord(e){
        e.preventDefault();
        const word = $("input#word").val().toLowerCase();
        const boardDim = $("table").data('id');
        const resp = await axios.get(`${window.origin}/${boardDim}/check_valid_word`, { params: { word}});
        if(resp.data.result==="ok"){
            if(this.words.has(word)){
                this.toggleMessage("You entered this word already...");
            } else{
                this.words.add(word);
                this.total += word.length;
                $("h3#total").text(`${this.total}`);
                $("h3#word_score").text(`${word.length}`);
                this.toggleMessage(this.messages[Math.floor(Math.random()*this.messages.length)])
            }
        } else {
            this.toggleMessage(resp.data.result);
        }
    }
}

         /* INITIALIZE OUR BOGGLEUTILITY FRONTEND*/
const boggleGame = new BoggleGameUtility();
boggleGame.move();

         /* EVENT LISTENERS */

$("#word-submit").on('submit', async function(e){
    await boggleGame.submitWord(e);
});

         /*cell handler*/
$("td").on('click',boggleGame.handleCells);
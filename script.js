var undoingText="";
function getWordStatsForNonEnglishText(nonEnglishText){
  var wordStats=[];
  var trimedText=$.trim(nonEnglishText);
  wordStats['num_character'] = trimedText.length;
  var wordList=trimedText.split(/[\s\n]+/);
  wordStats['num_word']=trimedText.length>0? wordList.length:0;
  return wordStats;
}
function updateStats(){
  getWordStats();
  densityStats();
}
function getWordStats(){
  
  var text = $("#textbox").val();
  var isNotEnglish=$("#isNotEnglish").prop('checked');
  var wordStats;

  if(isNotEnglish)
    wordStats = getWordStatsForNonEnglishText(text);
  else
    wordStats = $.wordCountTool.getWordStats(text);

  displayWordStats(wordStats);
  displayWordStatsInTitle(wordStats);  
}

function displayWordStats(wordStats){
  var isNotEnglish=$("#isNotEnglish").prop('checked');
  if(!isNotEnglish){
	  $("#num_word").text(wordStats['num_word']);
	  $("#num_word").text(wordStats['num_word']);		  
	  $("#num_character").text(wordStats['num_character']);
	  $("#num_character_wo_spaces").text(wordStats['num_character_wo_spaces']);
	  $("#num_sentence").text(wordStats['num_sentence']);
	  $("#num_paragraph").text(wordStats['num_paragraph']);
	  $("#avg_sentence_length").text(wordStats['avg_sentence_length']);
	  $("#avg_word_length").text(wordStats['avg_word_length']);
	  $("#dale_chall_readability").text(wordStats['dale_chall_index']);
	  $("#readability_level").text(getReadabilityLevel(wordStats['dale_chall_index']));
	  
	  var MAX_NUMBER_TO_DISPLAY_PERCENTAGE_SIGN= 10000;
	  var numDifficultWords=wordStats['num_difficult_words']< MAX_NUMBER_TO_DISPLAY_PERCENTAGE_SIGN? 
	  ""+wordStats['num_difficult_words']+" ("+wordStats['percentage_difficult_words']+"%)":""+wordStats['num_difficult_words'];
	  $("#num_difficult_word").text(numDifficultWords);	
	  
	  var numShortWords=wordStats['num_short_word']< MAX_NUMBER_TO_DISPLAY_PERCENTAGE_SIGN? 
	  ""+wordStats['num_short_word']+" ("+wordStats['percentage_num_short_word']+"%)":""+wordStats['num_short_word'];	  
	  $("#num_short_word").text(numShortWords);
	  /*
	  var numUniqueWords=wordStats['num_unique_word']< MAX_NUMBER_TO_DISPLAY_PERCENTAGE_SIGN? 
	  ""+wordStats['num_unique_word']+" ("+wordStats['percentage_num_unique_word']+"%)":""+wordStats['num_unique_word'];
	  $("#num_unique_word").text(numUniqueWords);
	  */
  }
  else{
	  $("#num_word").html("&nbsp;");
	  $("#num_difficult_word").html("&nbsp;");
	  $("#num_short_word").html("&nbsp;");
	  //$("#num_unique_word").html("&nbsp;");
	  $("#num_character").html("&nbsp;");
	  $("#num_character_wo_spaces").html("&nbsp;");
	  $("#num_sentence").html("&nbsp;");
	  $("#num_paragraph").html("&nbsp;");
	  $("#avg_sentence_length").html("&nbsp;");
	  $("#avg_word_length").html("&nbsp;");
	  $("#dale_chall_readability").html("&nbsp;");
	  $("#readability_level").html("&nbsp;");
  }
  //console.log("Number of difficult words: "+wordStats['num_difficult_words']);
}

function getReadabilityLevel(score){
  var readability="";
  if(score>10)
	readability+="graduate";
  else if(score>9)
		readability+="13-15th";
  else if(score>8)
		readability+="11-12th";
  else if(score>7)
		readability+="9-10th";
  else if(score>6)
        readability+="7-8th";
  else if(score>5)
		readability+="5-6th";
  else
	    readability+="< 4th";
  return readability;
}
function displayWordStatsInTitle(wordStats){
  var WORDS=" words";
  if(wordStats['num_word']==1)
    WORDS=" word";
  var CHARACTERS=" characters";  
  if(wordStats['num_character']==1)
    CHARACTERS=" character";
    
  var str=wordStats['num_word']+WORDS+", "+wordStats['num_character']+CHARACTERS+".";
  
  var isNotEnglish=$("#isNotEnglish").prop('checked');
  if(!isNotEnglish){
  	  var readability="<span id='readability'> Readability level: Easily understood by a ";
	  if(wordStats['dale_chall_index']>10)
		readability+="college graduate";
	  else if(wordStats['dale_chall_index']>9)
			readability+="college student";
	  else if(wordStats['dale_chall_index']>8)
			readability+="11-12th grade student";
	  else if(wordStats['dale_chall_index']>7)
			readability+="9-10th grade student";
	  else if(wordStats['dale_chall_index']>6)
	        readability+="7-8th grade student";
	  else if(wordStats['dale_chall_index']>5)
			readability+="5-6th grade student";
	  else
		    readability+="less than 4th grade";

	  str+=readability+".</span>";
  }
  $("#counter").html(str);
}

function sumWeight(weights){
  var sum=0;
  $.each(weights,function(){
    sum+=this;
  });
  return sum;
}
function displayWordCloud(){
	$('#myCanvasContainer').show();
	if( ! $('#myCanvas').tagcanvas({
		 weight:true,
		 weightMode:"both",
 		 weightFrom:"data-weight",
		 weightSizeMin:5,
		 weightSizeMax:150
	   },'tagList')) {
	     // TagCanvas failed to load
	     $('#myCanvasContainer').hide();
	}
}
function densityStats(){  
  var isNotEnglish=$("#isNotEnglish").prop('checked');
  if(isNotEnglish){
	$("#topDensity").html("");
	$('#myCanvasContainer').hide();
	return;
  }
  var numTop=parseInt($("#numTopKeyWord").val());;

  var viewWordCloud=$("#viewWordCloudCheckbox").prop('checked');
  if($("#excludingCheckbox").prop('checked'))
    $.wordStats.setStopWords(true);
  else
    $.wordStats.setStopWords(false);

  $.wordStats.computeTopWords(numTop,$("#textbox"));
  //var listHtml="<ol id='topDensityList'>";
  if(numTop>$.wordStats.topWords.length)
    numTop=$.wordStats.topWords.length;
  var sum=sumWeight($.wordStats.topWeights);
  var tagList=$('#tagList ul');
  tagList.empty();
  var tagListStr="";
  listHtml="<table id='densityList'><tr>";
  for(var i=0;i<numTop;i++){
    var word=$.wordStats.topWords[i];
    var weight=$.wordStats.topWeights[i];
    var percentage=(weight/sum*100).toFixed(1);
    var timeAppeared=weight>1?"times":"time";
	var orderInList=""+(i+1);	
    //listHtml+='<li><label><strong>'+order+'. '+word+'</strong> - '+weight+' '+time+'<span class="percentage"> ('+percentage+'%)</span></label></li>';	
	listHtml+='<td><label>'+orderInList+'. <strong>'+word+'</strong> - '+weight+' '+timeAppeared+'<span class="percentage"> ('+percentage+'%)</span></label></td>';
	if((i+1)%2==0){
		listHtml+="</tr><tr>";
	}	
	tagListStr+="<li><a href='javascript:void(0)' data-weight="+weight+">"+word+"</a></li>";	
  }
  listHtml+="</tr></table>";
  listHtml+="</ol>";
  $.wordStats.clear();
  $("#topDensity").html(listHtml);
  if(viewWordCloud){
    tagList.append(tagListStr);
    displayWordCloud();
  }
}

function generateClicked(){
  var typeOption = $('#typeOption').val();
  var amountOption = $('#amountOption').val();
  //console.log(amountOption);
  var lorem=$.lorem.getLorem({type:typeOption,amount:amountOption,ptags:false});
  $("#textbox").val(lorem);
  //console.log(lorem);
  getWordStats();
  densityStats();
}

function defaultValueForOption(){
  var typeOption = $('#typeOption').val();
  //console.log(typeOption);
  switch(typeOption){
    case "paragraphs":
      $('#amountOption').val("3")
      break;
    case "words":
      $('#amountOption').val("250")
      break;
    case "characters":
      $('#amountOption').val("1000")
      break;
  }
  generateClicked();
}

String.prototype.toTitleCase = function() {
    var i, str, lowers, uppers;
    str = this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

    // Certain minor words should be left lowercase unless 
    // they are the first or last words in the string
    lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At', 
    'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
    for (i = 0; i < lowers.length; i++)
        str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'), 
            function(txt) {
                return txt.toLowerCase();
            });

    // Certain words such as initialisms or acronyms should be left uppercase
    uppers = ['Id', 'Tv'];
    for (i = 0; i < uppers.length; i++)
        str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'), 
            uppers[i].toUpperCase());

    return str;
}

function convertCaseForText(){
  var text = $("#textbox").val();  
  var buttonID=$(this).attr("id");
  switch (buttonID){
	case "toUpperCaseButton":
	  undoingText=text;
	  text=text.toUpperCase();
	  break;
	case "toLowerCaseButton":
	  undoingText=text;
	  text=text.toLowerCase();
	  break;
	case "toSentenceCaseButton":
	  undoingText=text;
	  text=text+'.'
	  text=text.replace(/\w[^.?!:\n]*[.?!:\n$]+/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	  text=text.substr(0,text.length-1);
	  break;
	case "capitalizingEachwordCaseButton":
	  undoingText=text;
	  text=text.toTitleCase();	  
	  break;
	case "toggleCaseButton":
	  undoingText=text;
	  text=text.replace(/[\w]*/g, function(txt){return txt.charAt(0).toLowerCase() + txt.substr(1).toUpperCase();});
	  break;
	case "htmlStripButton":
	  undoingText=text;
	  html="<html>"+text+"</html>";
	  text=$(html).text();
	  break;
	case "clearTextButton":
	  undoingText=text;
	  text="";
	  break;
	case "undoButton":
	  if(undoingText.length!=0){
	    var temp=text;
	    text=undoingText;
	    undoingText=temp;
	  }
	  break;
  }    
  $("#textbox").val(text);
  updateStats();
}
$(document).ready(function(){
  var textbox=$("#textbox");
  textbox.focus();
  textbox.on('input propertychange',getWordStats);
  textbox.on('input propertychange',densityStats);
  textbox.bind('paste', function () {
  setTimeout(function () {
    getWordStats();
    densityStats();
  }, 10);
  });
  //$("#numTopKeyWord").on('keyup keypress blur change',densityStats);
  $("#numTopKeyWord").on('keyup blur change',densityStats);
  $("#excludingCheckbox").change(densityStats);
  $("#viewWordCloudCheckbox").change(densityStats);
  
  $("#isNotEnglish").change(getWordStats);
  $("#isNotEnglish").change(densityStats);

  $('#amountOption').on('keyup keypress blur change',generateClicked);
  //Generate
  $("#generate").click(generateClicked);
  //Options
  $("#typeOption").change(defaultValueForOption);

  //Case converter
  $(".convert input").click(convertCaseForText);
});

/*
function avoidEmptyStringList(list){
  if(list.length==1&&list[0]=="")
    return [];
  else 
    return list;
}
*/

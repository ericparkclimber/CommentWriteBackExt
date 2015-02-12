(function ($) {
var _ExtLoaded = false;
var _extension = 'CommentWriteBackExt';
var _pathShort = 'Extensions/' + _extension + '/';
var _pathLong = Qva.Remote + (Qva.Remote.indexOf('?') >= 0 ? '&' : '?') + 'public=only&name=' + _pathShort;
var _webview = window.location.host === 'qlikview';
var _path = (_webview ? _pathShort : _pathLong);
var _CurrentSelections = [];
var _FieldsToMatch = [];
function CommentWriteBack_Init() {
    Qv.AddExtension(_extension,
        function () {

            var _WEB_SERVICE_URL,_CONNECTIONNAME,_SQLTABLE,_AUDITTABLE,_CSS_FILE_NAME,_APIKEY,_OSUSER;

            $.support.cors = true;

            var _this = this;

            // Add CSS
            Qva.LoadCSS(Qva.Remote + (Qva.Remote.indexOf('?') >= 0 ? '&' : '?') + 'public=only' + '&name=' + "Extensions/" + _extension + "/CommentWriteBackExt.css");

            // Retrieve extension properties

            if(!_ExtLoaded){
            	setProps();
	            $(_this.Element).empty();

	            initGrid();

	            initializeCurrentSelections();
	           	_ExtLoaded = true;
            }

            // initLoadingPane("Loading data ...");
            // showLoadingPanel("loading data ...");
            // initGrid();
            // loadData(data_loaded);


            // ------------------------------------------------------
            // Set Properties
            // ------------------------------------------------------
            function setProps() {

                _WEB_SERVICE_URL = _this.Layout.Text0.text;

                if(_WEB_SERVICE_URL.slice(-1) == "/" || _WEB_SERVICE_URL.slice(-1) == "\\"){
                    _WEB_SERVICE_URL = _WEB_SERVICE_URL.substr(0, _WEB_SERVICE_URL.length - 1);
                }

                _CONNECTIONNAME = _this.Layout.Text1.text;

                _SQLTABLE = _this.Layout.Text2.text;

                _AUDITTABLE = _this.Layout.Text3.text;

                _CSS_FILE_NAME = _this.Layout.Text4.text;


                _APIKEY = _this.Layout.Text5.text;

                _OSUSER = _this.Layout.Text6.text;

                SaveSelectionFields();
            }

            // ------------------------------------------------------------------
            // Html structure
            // ------------------------------------------------------------------
            function initGrid() {
                var contentDiv = document.createElement("div");
                contentDiv.className = "commentWBBody";

                var TopDiv = document.createElement("div");
                TopDiv.className = "TopDiv";

                var CommentContainer = document.createElement("div");
                CommentContainer.className = "CommentContainer";
                CommentContainer.id = "CommentContainer" + GetSafeId();
                addPushDiv(CommentContainer);

                var addCommentDiv = document.createElement("div");
                addCommentDiv.className = "addCommentDiv";

                var addCommentButton = document.createElement("input");
                addCommentButton.setAttribute("type","button");
                addCommentButton.value = "Add Comment";
                addCommentButton.className = "addCommentBtn";

                addCommentDiv.appendChild(addCommentButton);

                TopDiv.appendChild(CommentContainer);
                TopDiv.appendChild(addCommentDiv);

                var BottomDiv = document.createElement("div");
                BottomDiv.id = "BottomDiv";

                //BOTTOM DIV STUFF

                contentDiv.appendChild(TopDiv);
                contentDiv.appendChild(BottomDiv);

                 _this.Element.appendChild(contentDiv);
            }

            function addPushDiv(elem){
                var pushDiv = document.createElement("div");
                pushDiv.className = "push";
                elem.appendChild(pushDiv);
            }

            function clearCommentContainer(){
                var container = document.getElementById('CommentContainer' + GetSafeId());
                container.innerHTML = '';
                addPushDiv(container);
            }
            // ------------------------------------------------------------------
            // Data related
            // ------------------------------------------------------------------
            function initializeCurrentSelections() {
	            if(!_ExtLoaded){
	            	var currentSelectionOptions = 
					{
						onChange: function() {
							var data = this.Data.Rows;
							_CurrentSelections = [];
							var k = 0;
							for (var i = 0; i < data.length; i++) {
								for(var j = 0; j < _FieldsToMatch.length; j++){
									if(data[i][0].text == _FieldsToMatch[j]){
										_CurrentSelections.push({FieldName:data[i][0].text,FieldValue:data[i][2].text});
										//alert('FOUND SOMETHING');
									}
								}
							}
							SOMETHING();
						}
					};

					Qv.GetDocument().GetCurrentSelections(currentSelectionOptions);
					SOMETHING();
	            }	


			}

			function SOMETHING(){
				// var alertStr = '';
				// for(var i = 0; i< _CurrentSelections.length; i++){
				// 	alertStr += JSON.stringify(_CurrentSelections[i]) + '\n';
				// }
				// alert(alertStr);
				//alert('HAI');
				if(_CurrentSelections.length == _FieldsToMatch.length){
					//alert('matched the fields')
					var data = {'Table':_SQLTABLE,'ConnectionName':_CONNECTIONNAME,'OSUser':_OSUSER,'APIKey':_APIKEY,'FieldValuePairs':[]};
					//alert('1:' + JSON.stringify(data));
					for(var i = 0; i < _CurrentSelections.length; i++){
                        data.FieldValuePairs.push({'FieldName':encodeURI(_CurrentSelections[i].FieldName),'FieldValue':encodeURI(_CurrentSelections[i].FieldValue)});
					}

					PostgetComments(data);
				}
				else{
					clearCommentContainer();
				}
			}

			function SOMETHINGELSE(){
				//alert('clicked');
				var commentToAdd = $('#AddCommentTextArea' + GetSafeId()).val().trim();
				if(commentToAdd != ''){
					var data = {'Comment':commentToAdd,'Table':_SQLTABLE,'TransactionTable':_AUDITTABLE,'ConnectionName':_CONNECTIONNAME,'OSUser':_OSUSER,'APIKey':_APIKEY,'FieldValuePairs':[]};
					//alert('1:' + JSON.stringify(data));
					for(var i = 0; i < _CurrentSelections.length; i++){
						data.FieldValuePairs.push({'FieldName':encodeURI(_CurrentSelections[i].FieldName),'FieldValue':encodeURI(_CurrentSelections[i].FieldValue)});
					}

					PostAddComment(data);
				}
			}
			function SaveSelectionFields(){
        		_FieldsToMatch = [];
				for (var i = 0; i < _this.Data.HeaderRows.length; i++) {
                    for (var j = 0; j <  _this.Data.HeaderRows[0].length - 1; j++) {
                    	_FieldsToMatch.push(_this.Data.HeaderRows[i][j].text);
                    }
                }
			}

			function displayComments(CommentsList){
				var CommentStr = '';
				for(var i = 0; i < CommentsList.length; i++){
					var DateTimeAdded = new Date(parseInt(CommentsList[i].DateAdded.replace("/Date(", "").replace(")/",""), 10));

					CommentStr += decodeURI(CommentsList[i].User) + ' (' + DateTimeAdded.myFormat() + "):" + decodeURI(CommentsList[i].Message) + "\n\n";
				}

				$('#DisplayCommentTextArea' + GetSafeId()).val(CommentStr);
			}

            function DisplayComment(Comment){
                var DateTimeAdded = new Date(parseInt(Comment.DateAdded.replace("/Date(", "").replace(")/",""), 10));

                var commentDiv = document.createElement("div");
                commentDiv.className = "WBComment";

                var commentTitle = document.createElement("div");
                commentTitle.className = "CommentTitle";
                commentTitle.innerHTML = '<span class="CommentUser"><b>' + decodeURI(Comment.User) + '</b></span>'
                                        + '<span class="CommentDate">' + DateTimeAdded.myFormat() + '</span>';

                var commentBody = document.createElement("div");
                commentBody.className = "CommentBody";
                commentBody.innerHTML = '<span>' + Comment.Message + '</span>';
                // alert(decodeURI(Comment.Message));
                commentDiv.appendChild(commentTitle);
                commentDiv.appendChild(commentBody);

                $('#CommentContainer' + GetSafeId()).append(commentDiv);
            }

            // ------------------------------------------------------------------
            // Loading Panel
            // ------------------------------------------------------------------
            function showLoadingPanel(msg) {
                if (msg != '') { $('#loadingInnerMsg_' + GetSafeId()).innerText = msg };
                $("#loadingPanel_" + GetSafeId()).show();
            }

            function hideLoadingPanel() {
                $("#loadingPanel_" + GetSafeId()).hide();
            }

            function initLoadingPane() {

                var divLoader = document.createElement("div");
                divLoader.className = "divLoading";
                divLoader.id = "loadingPanel_" + GetSafeId();

                var imageUrl = Qva.Remote + (Qva.Remote.indexOf('?') >= 0 ? '&' : '?') + 'public=only' + '&name=' + 'Extensions/' + _extension + '/Loading.gif';
                var loadingMsg = document.createElement("div");
                loadingMsg.style.width = GetTableWidth();
                loadingMsg.style.textAlign = "center";

                var loadingInnerMsg = document.createElement("div");
                loadingInnerMsg.id = "loadingInnerMsg_" + GetSafeId();
                loadingInnerMsg.className = "loadingInnerMsg";
                //loadingInnerMsg.innerText = "Loading data ...";


                var loadingImg = document.createElement("img");
                loadingImg.src = imageUrl;
                loadingImg.className = "loadingImg";
                loadingImg.style.paddingTop = (_this.GetHeight() / 2) - 40 + "px";

                loadingMsg.appendChild(loadingImg);
                loadingMsg.appendChild(loadingInnerMsg);
                divLoader.appendChild(loadingMsg);

                _this.Element.appendChild(divLoader);

            }

            // ------------------------------------------------------------------
            // Internal Methods
            // ------------------------------------------------------------------
            function GetTableHeight() {
                _this.GetHeight() - 35 + "px";
            }

            function GetTableWidth() {
                _this.GetWidth() + "px";
            }

            function safeId(str) {
                return str.replace("\\", "_");
            }

            function GetSafeId() {
                return safeId(_this.Layout.ObjectId);
            }

            // ------------------------------------------------------------------
            // Events ...
            // ------------------------------------------------------------------

            function AddComment(){
            	//alert('hai');
            	$('#DisplayDiv' + GetSafeId()).toggleClass('addingComment');
            	$('#CommentDiv' + GetSafeId()).toggleClass('active');
            	$('#AddCommentButton'+ GetSafeId()).toggleClass('hide');
            	$('#exitCommentButton' + GetSafeId()).toggleClass('hide');
            }

            function PostgetComments(params){
            	var testData = {'Table':'Hi'};
                $.ajax({
                    type: "GET",
                    url: _WEB_SERVICE_URL + '/Comment/getComments',
                    dataType: 'json',
                    data: $.postify(params),
                    success:function(data){
                    	if(data.hasComments){
                    		// displayComments(data.Comments);
                            $('#CommentContainer' + GetSafeId()).val('');
                            var container = document.getElementById('CommentContainer' + GetSafeId());
                            container.innerHTML = '';
                            for(var i = 0; i < data.Comments.length; i++){
                                DisplayComment(data.Comments[i]);
                            }
                            addPushDiv(container);
                    	}
                    	else{
                    		clearCommentContainer();
                    	}
                    },
                    error: function (xhr, textStatus, thrownError) {
                        alert(thrownError + ' - ' + xhr.responseText + ' - ' + textStatus);
                    }
                });

            }

            function PostAddComment(params){
	            $.ajax({
	                type: 'POST',
					data: $.postify(params),
					dataType: 'json',
					url: _WEB_SERVICE_URL + '/Comment/addComments',		    
	                success:function(data){
	                	if(data.Success){
	                		$('#AddCommentTextArea' + GetSafeId()).val('');
	                		SOMETHING();
	                	}
	                   	
	                },
	                error: function (xhr, textStatus, thrownError) {
	                    alert(thrownError + ' - ' + xhr.responseText + ' - ' + textStatus);
	                }
	            });
            }
        }, true);
}


CommentWriteBack_Init();


// jQuery Extensions
$.fn.toggleCheckbox = function () {
    this.attr('checked', !this.attr('checked'));
}

$.postify = function(value) {
    var result = {};
 
    var buildResult = function(object, prefix) {
        for (var key in object) {
 
            var postKey = isFinite(key)
                ? (prefix != "" ? prefix : "") + "[" + key + "]"
                : (prefix != "" ? prefix + "." : "") + key;
 
            switch (typeof (object[key])) {
                case "number": case "string": case "boolean":
                    result[postKey] = object[key];
                    break;
 
                case "object":
                    if (object[key].toUTCString)
                        result[postKey] = object[key].toUTCString().replace("UTC", "GMT");
                    else {
                        buildResult(object[key], postKey != "" ? postKey : key);
                    }
            }
        }
    };
 
    buildResult(value, "");
 
    return result;
};

Date.prototype.myFormat = function() {
   //Grab each of your components
   var yyyy = this.getFullYear().toString();
   var yy = yyyy.slice(-2);
   var MM = (this.getMonth()+1).toString();
   var dd  = this.getDate().toString();
   var hh = this.getHours().toString();
   var mm = this.getMinutes().toString();
   var ss = this.getSeconds().toString();

   //Returns your formatted result
   return (dd[1]?dd:"0"+dd[0]) + '/' + (MM[1]?MM:"0"+MM[0]) + '/' + yy + ' ' + (hh[1]?hh:"0"+hh[0]) + ':' + (mm[1]?mm:"0"+mm[0]);
};

// Some helper functions
function alertProps(o) {
    var sMsg = "";
    for (var key in o) {
        if (o.hasOwnProperty(key)) {
            //alert(key + " -> " + o[key]);
            sMsg += key + " -> " + o[key] + "\n";
        }
    }
    alert(sMsg);
}

})(jQuery);

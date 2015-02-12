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
            if (!_this.ExtensionLoaded) {
                this.ExtensionLoaded = true;
            }
            else {
                //alert('Extension loaded for ' + _this.Layout.ObjectId);
            }

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
                // see http://stackoverflow.com/questions/139000/div-with-overflowauto-and-a-100-wide-table-problem
                // for browsers < IE7
                //tableDiv.style.width = _this.GetWidth() + "px";
                //tableDiv.style.height = _this.GetHeight() - 35 + "px";
                contentDiv.style.height = "100%";
                contentDiv.style.width = "100%";
                contentDiv.className = "contentDiv";

                var DisplayDiv = document.createElement("div");
                //DisplayDiv.style.height = "100%";
                DisplayDiv.style.width = "100%";
                DisplayDiv.id = 'DisplayDiv' + GetSafeId();
                DisplayDiv.className = "DisplayDiv";

                var DisplayTextDiv = document.createElement("div");
                DisplayTextDiv.style.height = "90%";
                DisplayTextDiv.style.width = "100%";
                DisplayDiv.appendChild(DisplayTextDiv)

                var DisplayCommentTextArea = document.createElement("textarea");
                DisplayCommentTextArea.id = "DisplayCommentTextArea" + GetSafeId();
                DisplayCommentTextArea.className = "DisplayCommentTextArea";
                DisplayCommentTextArea.style.height = "100%";
                DisplayCommentTextArea.style.width = "100%"
                DisplayTextDiv.appendChild(DisplayCommentTextArea);

                var AddCommentDiv = document.createElement("div");
                AddCommentDiv.style.height = "10%";
                AddCommentDiv.style.width = "100%";
                DisplayDiv.appendChild(AddCommentDiv);

                var AddCommentButton = document.createElement("input")
                AddCommentButton.type = "button";
                AddCommentButton.value = "Add Comment";
                AddCommentButton.id = "AddCommentButton" + GetSafeId();
                AddCommentButton.className = "AddCommentButton";
                AddCommentButton.addEventListener("click", AddComment, false);
                AddCommentDiv.appendChild(AddCommentButton)

                var exitCommentButton = document.createElement("input");
                exitCommentButton.type = "button";
                exitCommentButton.value = "hide comments";
                exitCommentButton.id = "exitCommentButton" + GetSafeId();
                exitCommentButton.className = "exitCommentButton hide";
                exitCommentButton.addEventListener("click", AddComment, false);
                AddCommentDiv.appendChild(exitCommentButton)

                contentDiv.appendChild(DisplayDiv);

                var CommentDiv = document.createElement("div");
                CommentDiv.style.height = "50%";
                CommentDiv.style.width = "100%";
                CommentDiv.className = "CommentDiv inactive";
                CommentDiv.id = "CommentDiv" + GetSafeId();

                var AddTextDiv = document.createElement("div");
                AddTextDiv.style.height = "80%";
                AddTextDiv.style.width = "100%";
                CommentDiv.appendChild(AddTextDiv)

                var AddCommentTextAarea = document.createElement("textarea");
                AddCommentTextAarea.id = "AddCommentTextArea" + GetSafeId();
                AddCommentTextAarea.className = "AddCommentTextArea";
                AddCommentTextAarea.style.height = "100%";
                AddCommentTextAarea.style.width = "100%"
                AddTextDiv.appendChild(AddCommentTextAarea);

                var SaveCommentDiv = document.createElement("div");
                SaveCommentDiv.style.height = "20%";
                SaveCommentDiv.style.width = "100%";
                CommentDiv.appendChild(SaveCommentDiv);

                var SaveCommentButton = document.createElement("input")
                SaveCommentButton.type = "button";
                SaveCommentButton.value = "Save Comment";
                SaveCommentButton.className = 'SaveCommentButton';
                SaveCommentButton.addEventListener("click", SOMETHINGELSE, false);
                SaveCommentDiv.appendChild(SaveCommentButton)

                contentDiv.appendChild(CommentDiv);

                _this.Element.appendChild(contentDiv);

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
					$('#DisplayCommentTextArea' + GetSafeId()).val('');
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
                    		displayComments(data.Comments);
                    	}
                    	else{
                    		$('#DisplayCommentTextArea' + GetSafeId()).val('');
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
   var MM = (this.getMonth()+1).toString();
   var dd  = this.getDate().toString();
   var hh = this.getHours().toString();
   var mm = this.getMinutes().toString();
   var ss = this.getSeconds().toString();

   //Returns your formatted result
   return (dd[1]?dd:"0"+dd[0]) + '/' + (MM[1]?MM:"0"+MM[0]) + '/' + yyyy + ' ' + (hh[1]?hh:"0"+hh[0]) + ':' + (mm[1]?mm:"0"+mm[0]);
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

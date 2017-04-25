import $ from 'jquery'
import 'select2'
import 'select2/dist/css/select2.css'

$(initTournamentCreator)
//TODO Unicité des participants et unicité du nom du tournoi
function initTournamentCreator () {
  $('.select2-enable').select2()

  let $participantSearcher = $('#participantSearcher')
  let $participantSearcherContainer = $('#participantSearcherContainer')
  let participantSearcherSelect2
  addListenersToParticipantSearcher()

  $('#participantAdder').on('click', function () {
    $('#participantAdderBtn').hide()
    if ($participantSearcher.attr('disabled')) {
      activateParticipantSearcher()
    }
  })

  function addAutoCompleteForParticipantSearcher () {
    const data = [{id: 0, text: 'bob'}, {id: 1, text: 'thomas'}]
    participantSearcherSelect2 = $participantSearcher.select2({
      placeholder: 'Search participant',
      data: data})
    participantSearcherSelect2.select2('open')
    // {
    //   ajax: {
    //     url: "https://api.github.com/search/repositories",
    //     dataType: 'json',
    //     delay: 250,
    //     data: function (params) {
    //       return {
    //         q: params.term, // search term
    //         page: params.page
    //       }
    //     },
    //     processResults: function (data, params) {
    //       // parse the results into the format expected by Select2
    //       // since we are using custom formatting functions we do not need to
    //       // alter the remote JSON data, except to indicate that infinite
    //       // scrolling can be used
    //       params.page = params.page || 1

    //       return {
    //         results: data.items,
    //         pagination: {
    //           more: (params.page * 30) < data.total_count
    //         }
    //       }
    //     },
    //     cache: true
    //   },
    //   escapeMarkup: function (markup) { return markup }, // let our custom formatter work
    //   minimumInputLength: 1
    // }
  }

  // Add the listeners that triggers participantSearcher (send the input value as a participant)
  function addListenersToParticipantSearcher () {
    // If user presses enter in the searcher
    // $participantSearcher.on('keypress', function (e) {
    //   if (e.which === 13) {
    //     participantSearcherTriggered()
    //   }
    // })
    $participantSearcher.on('select2:select', function (e) {
      participantSearcherTriggered(e.params.data.text)
    })
    // TODO : if the user clicks on autocomplete value
  }

  function activateParticipantSearcher () {
    $participantSearcher.removeAttr('disabled')
    $participantSearcherContainer.show()
    addAutoCompleteForParticipantSearcher()
  }

  function participantSearcherTriggered (participantToAdd) {
    $participantSearcher.attr('disabled', 'disabled')
    addParticipant(participantToAdd)
    participantSearcherSelect2.val(null).trigger('change')
    $participantSearcherContainer.hide()
    $('#participantAdderBtn').show()
  }

  function addParticipant (participant) {
    if (participant) {
      let $participantToAdd = $('<div>' + participant + '</div>').attr('class', 'col-md-2 participant-icon')
      $participantToAdd.on('click', function () {
        $participantToAdd.remove()
      })
      $('#participantList').append($participantToAdd)
    }
  }
}

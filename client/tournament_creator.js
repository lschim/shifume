import $ from 'jquery'
import 'select2'
import 'select2/dist/css/select2.css'

$(initTournamentCreator)
// TODO Unicité des participants
// Unicité du nom du tournoi

function initTournamentCreator () {
  $('.select2-enable').select2()

  let $participantSearcher = $('#participantSearcher')
  let $participantSearcherContainer = $('#participantSearcherContainer')
  let participantSearcherSelect2
  addListenersToParticipantSearcher()
  addListenersTournamentCreator()

  $('#participantAdder').on('click', function () {
    $('#participantAdderBtn').hide()
    if ($participantSearcher.attr('disabled')) {
      activateParticipantSearcher()
    }
  })

  function participantSearcherTriggered (participantToAdd) {
    $participantSearcher.attr('disabled', 'disabled')
    addParticipant(participantToAdd)
    participantSearcherSelect2.val(null).trigger('change')
    $participantSearcherContainer.hide()
    $('#participantAdderBtn').show()
  }

  function addAutoCompleteForParticipantSearcher () {
    participantSearcherSelect2 = $participantSearcher.select2({
      placeholder: 'Search participant',
      ajax: {
        url: '/user/search', //TODO add parameter for the search
        dataType: 'json',
        delay: 250,
        processResults: function (data, params) {
          params.page = params.page || 1
          data.forEach((item, index) => {
            item.id = index
            item.text = item._id
          })
          return {
            results: data,
            pagination: {
              more: (params.page * 30) < data.length
            }
          }
        },
        cache: false
      },
      escapeMarkup: function (markup) { return markup }, // let our custom formatter work
      minimumInputLength: 1})
    participantSearcherSelect2.select2('open')
  }

  // Add the listeners that triggers participantSearcher (send the input value as a participant)
  function addListenersToParticipantSearcher () {
    $participantSearcher.on('select2:select', function (e) {
      participantSearcherTriggered(e.params.data.text)
    })
  }

  // Shows and activate the select to pick a participant
  function activateParticipantSearcher () {
    $participantSearcher.removeAttr('disabled')
    $participantSearcherContainer.show()
    addAutoCompleteForParticipantSearcher()
  }

  // Add a participant to the list
  function addParticipant (participant) {
    if (participant) {
      let $participantToAdd = $('<div>' + participant + '</div>').attr('class', 'col-md-2 participant-icon')
      $participantToAdd.on('click', function () {
        $participantToAdd.remove()
      })
      $('#participantList').append($participantToAdd)
    }
  }

  function addListenersTournamentCreator () {
    const tournamentCreator = $('#tournamentCreator')
    tournamentCreator.on('click', function () {
      // Gather the participants
      // TODO This is a draft because I'm in the plane without doc. Embelish the loop !!
      const participants = []

      let e = $('.participant-icon')
      for (let i = 0; i < e.length; i++) {
        participants.push(e[i].innerText)
      }
      const name = $('#tournamentName').val()
      console.log('name : ' + name)
      console.log(participants)
      // TODO : Ajax the request
      $.ajax({
        type: 'POST',
        url: '/tournament/create',
        data: {name: name, participants: participants},
        dataType: 'json',
        success: function (data, textStatus) {
          //TODO redirect on the page of the tournament
        }
      })
    })
  }
}

import $ from 'jquery'

console.log('Bob')
$('#participantAdder').on('click', function () {
  addParticipant($('#participantSearcher').value())
})

function addParticipant (participant) {
  console.alert('Added participant')
}

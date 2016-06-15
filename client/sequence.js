import $ from 'jquery'

$(initSequence)
function initSequence () {
  const sequence = [10]
  var sequence_index = 0 // Next sequence to fill

  $.get('/user/get_sequence').then((res) => {
    var sequence_str = res.data.sequence
    if (sequence_str) {
      sequence_str.split[''].forEach((move) =>
        add_move(move, false)
      )
    }
  }).fail((err) => console.log(err))

  function reset_sequence () {
    sequence.forEach((move, index) => {
      $('#move' + index).attr('src', 'http://placehold.it/1x1')
      sequence[index] = ''
    })
    sequence_index = 0
  }

  const srcImage = {'R': {src: '/img/rock.jpg', alt: 'rock'},
                    'P': {src: '/img/paper.jpg', alt: 'paper'},
                    'S': {src: '/img/scissor.jpg', alt: 'scissor'}
                    }

  function add_move (move, saveWhenFull) {
    if (sequence_index < 10) {
      sequence[sequence_index] = move
      $('#move' + sequence_index).attr('src', srcImage[move].src)
      $('#move' + sequence_index).attr('alt', srcImage[move].alt)

      sequence_index++
      if (sequence_index === 10 && saveWhenFull) {
        save_sequence()
      }
    }
  }

  function show_selectors () {
    // Make selectors div appear
    $('#edit_sequence').hide()
    $('#move_selectors').show()
    $('#done_sequence').show()
  }

  function hide_selectors () {
    $('#done_sequence').hide()
    $('#move_selectors').hide()
    $('#edit_sequence').show()
  }

  function save_sequence () {
    hide_selectors()
    $.ajax({
      type: 'POST',
      url: '/user/set_sequence',
      data: {sequence: sequence.join('')},
      dataType: 'json',
      success: function (data, textStatus) {
        if (data.redirect) {
          // data.redirect contains the string URL to redirect to
          window.location.href = data.redirect
        } else {
          hide_selectors()
        }
      }
    })
  }

  $('.move_selector').on('click', function (e) {
    add_move($(e.target).data('selector'), true)
  })

  $('#done_sequence').on('click', function () {
    save_sequence()
  })

  $('#edit_sequence').on('click', function () {
    reset_sequence()
    show_selectors()
  })
}


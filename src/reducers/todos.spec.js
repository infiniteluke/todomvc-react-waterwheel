import todos from './todos'
import * as types from '../constants/ActionTypes'

describe('todos reducer', () => {
  it('should handle initial state', () => {
    expect(
      todos(undefined, {})
    ).toEqual([
      {
        text: 'Use Redux',
        completed: false,
        id: 0
      }
    ])
  })

  it('should handle ADD_TODO', () => {
    expect(
      todos([], {
        type: types.ADD_TODO,
        todo: {
          text: 'Run the tests',
          completed: false,
          id: '12345-67789-86794',
        }
      })
    ).toEqual([
      {
        text: 'Run the tests',
        completed: false,
        id: '12345-67789-86794'
      }
    ])

    expect(
      todos([{
        text: 'Run the tests',
        completed: false,
        id: '12345-67789-86794'
      }], {
        type: types.ADD_TODO,
        todo: {
          text: 'Use Redux',
          completed: false,
          id: '45345-76767-test',
        }
      })
    ).toEqual([
      {
        text: 'Use Redux',
        completed: false,
        id: '45345-76767-test'
      },
      {
        text: 'Run the tests',
        completed: false,
        id: '12345-67789-86794'
      }
    ])

    expect(
      todos([
        {
          text: 'Use Redux',
          completed: false,
          id: '45345-76767-test'
        },
        {
          text: 'Run the tests',
          completed: false,
          id: '12345-67789-86794'
        }
      ], {
        type: types.ADD_TODO,
        todo: {
          text: 'Fix the tests',
          completed: false,
          id: '634-2345-test123',
        }
      })
    ).toEqual([
      {
        text: 'Fix the tests',
        completed: false,
        id: '634-2345-test123'
      }, {
        text: 'Use Redux',
        completed: false,
        id: '45345-76767-test'
      }, {
        text: 'Run the tests',
        completed: false,
        id: '12345-67789-86794'
      }
    ])
  })

  it('should handle DELETE_TODO', () => {
    expect(
      todos([
        {
          text: 'Run the tests',
          completed: false,
          id: 1
        }, {
          text: 'Use Redux',
          completed: false,
          id: 0
        }
      ], {
        type: types.DELETE_TODO,
        id: 1
      })
    ).toEqual([
      {
        text: 'Use Redux',
        completed: false,
        id: 0
      }
    ])
  })

  it('should handle EDIT_TODO', () => {
    expect(
      todos([
        {
          text: 'Run the tests',
          completed: false,
          id: 1
        }, {
          text: 'Use Redux',
          completed: false,
          id: 0
        }
      ], {
        type: types.EDIT_TODO,
        text: 'Fix the tests',
        id: 1
      })
    ).toEqual([
      {
        text: 'Fix the tests',
        completed: false,
        id: 1
      }, {
        text: 'Use Redux',
        completed: false,
        id: 0
      }
    ])
  })

  it('should handle COMPLETE_TODO', () => {
    expect(
      todos([
        {
          text: 'Run the tests',
          completed: false,
          id: 1
        }, {
          text: 'Use Redux',
          completed: false,
          id: 0
        }
      ], {
        type: types.COMPLETE_TODO,
        id: 1
      })
    ).toEqual([
      {
        text: 'Run the tests',
        completed: true,
        id: 1
      }, {
        text: 'Use Redux',
        completed: false,
        id: 0
      }
    ])
  })

  it('should handle COMPLETE_ALL', () => {
    expect(
      todos([
        {
          text: 'Run the tests',
          completed: true,
          id: 1
        }, {
          text: 'Use Redux',
          completed: false,
          id: 0
        }
      ], {
        type: types.COMPLETE_ALL
      })
    ).toEqual([
      {
        text: 'Run the tests',
        completed: true,
        id: 1
      }, {
        text: 'Use Redux',
        completed: true,
        id: 0
      }
    ])

    // Unmark if all todos are currently completed
    expect(
      todos([
        {
          text: 'Run the tests',
          completed: true,
          id: 1
        }, {
          text: 'Use Redux',
          completed: true,
          id: 0
        }
      ], {
        type: types.COMPLETE_ALL
      })
    ).toEqual([
      {
        text: 'Run the tests',
        completed: false,
        id: 1
      }, {
        text: 'Use Redux',
        completed: false,
        id: 0
      }
    ])
  })

  it('should handle CLEAR_COMPLETED', () => {
    expect(
      todos([
        {
          text: 'Run the tests',
          completed: true,
          id: 1
        }, {
          text: 'Use Redux',
          completed: false,
          id: 0
        }
      ], {
        type: types.CLEAR_COMPLETED
      })
    ).toEqual([
      {
        text: 'Use Redux',
        completed: false,
        id: 0
      }
    ])
  })
})

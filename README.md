# Tasky

## Simple Flow Diagram Task Management

[Tasky](https://tasky.fyreworks.us) is a simple flow diagram task management system heavily inspired by [TwigTask](https://twigtask.com/). It allows you to create tasks, link them up with other tasks as dependencies and dependents, and easily see which tasks are unblocked and can be completed next.

It does this with a flow diagram system where you can connect from one task to another by dragging and dropping. The task canvas supports seamless panning and zooming, and adding a new task is as simple as clicking on the canvas and typing in the name of your task.

It also allows you to separate your tasks into different flows, and tasks can appear on multiple flows at the same time.

Finally, it automatically persists the current flow into your browser's localStorage, supports JSON import and export, and will eventually support online persistence through Firebase.

### Getting Started

Tasky is a client-side only app, which means you can import and run this code using [this Codesandbox link](https://codesandbox.io/s/github/alexanderson1993/tasky).

Otherwise, clone the repo, and then run the following to start development mode:

```bash
yarn
yarn start
```

### How It's Built

I specifically built Tasky to play around with a few tools that I've never used before. Specifically:

- [Chakra UI](https://chakra-ui.com/) - a Theme-UI compatible component library
- [Parcel 2](https://github.com/parcel-bundler/parcel) - a fast and helpful bundler
- [Recoil](https://recoiljs.org/) - a graph-based state manager for React

Tasky also uses a few more tools and libraries:

- [Emotion](https://emotion.sh/) - CSS-in-JS styling
- [Downshift](https://github.com/downshift-js/downshift) - Easy dropdowns and selects
- [Match Sorter](https://github.com/kentcdodds/match-sorter) - Filtering and sorting made easy
- [React](https://reactjs.org/) - Component-based user interface library
- [React Beautiful DnD](https://github.com/atlassian/react-beautiful-dnd) - Drag and drop for reordering flows
- [React Easy PanZoom](https://github.com/mnogueron/react-easy-panzoom) - Powerful and easy panning and zooming
- [React Use Gesture](https://use-gesture.netlify.app/) - React hooks for user gestures

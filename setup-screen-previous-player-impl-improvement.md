# Setup-screen previous-player implementation improvement

Update the previous-player checkbox state handling in `src/Setup.tsx` to use the functional form of `setAvailablePlayers`. Map over the latest state and update only the matching player's `checked` value, preserving the rest of that player's fields and all other players' state.

## Prompts (verbatim)

> this state update, updating everything, but overriding checked state for current item with onchange, legit, or too much, and some other higher level check state kept

```jsx
<input 
                                    type="checkbox" 
                                    className="checkbox checkbox-lg my-3" 
                                    checked={x.checked}
                                    onChange={
                                        (e) => setAvailablePlayers(
                                            [
                                                ...availablePlayers.map(
                                                    y => (
                                                        {
                                                            ...y,
                                                            checked: y.name === x.name
                                                                ? e.target.checked
                                                                : y.checked
                                                        }
                                                    )
                                                )
                                            ]
                                        )
                                    }
                                />
```

> so functional setter, passes existing, and just map those as opposed to from the top

> go ahead and update the code please

> setup-screen-previous-player-impl-improvement.md with these prompts please

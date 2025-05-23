# iOS Input Runtime Error - RESOLVED ✅

## Solution: Use iOS-Compatible UI Elements

The issue was resolved by completely avoiding native HTML input elements on iOS devices. Instead, we use a custom component that:
- On iOS: Shows a native prompt() dialog
- On non-iOS: Uses a click-to-edit div approach

This bypasses all iOS Safari input focus issues.

---

# Original Investigation and Solutions

## Problem Description
When clicking on the input field in the UserSelector component on iOS Safari, we get:
```
Uncaught runtime errors:
ERROR
Script error.
handleError@http://192.168.1.228:3000/static/js/bundle.js:39079:67
```

## What We've Tried So Far

### 1. ❌ Removed autoFocus attribute
- **What**: Removed the `autoFocus` prop from the input element
- **Why**: autoFocus is known to cause issues on iOS Safari
- **Result**: Error still persists when manually clicking the input

### 2. ❌ Removed programmatic focus
- **What**: Removed `setTimeout` focus logic after showing create form
- **Why**: iOS Safari restricts programmatic focus for security
- **Result**: Error still occurs on manual click

### 3. ❌ Added iOS-specific input attributes
- **What**: Added `autoComplete="off"`, `autoCorrect="off"`, `autoCapitalize="off"`, `spellCheck="false"`
- **Why**: To prevent iOS-specific behaviors that might trigger errors
- **Result**: No improvement

### 4. ❌ CSS fixes for iOS
- **What**: Added `-webkit-appearance: none`, font-size: 16px, transform3d hack
- **Why**: Common iOS Safari CSS fixes
- **Result**: No improvement

## Root Cause Analysis

Based on research, the issue is likely caused by:

1. **Multiple onFocus Events Bug** - Safari fires onFocus multiple times, which could be causing React's event system to error
2. **Safari's Restrictive Focus Handling** - iOS Safari has security restrictions on focus events
3. **React Synthetic Event Issues** - React's event system may conflict with Safari's native behavior

## Solutions to Try

### High Priority

1. **[ ] Wrap input in error boundary**
   ```jsx
   class InputErrorBoundary extends React.Component {
     componentDidCatch(error, info) {
       console.log('Input error caught:', error);
     }
     render() {
       return this.props.children;
     }
   }
   ```

2. **[ ] Use onTouchStart instead of onClick**
   ```jsx
   <input
     onTouchStart={(e) => e.currentTarget.focus()}
     onClick={(e) => e.stopPropagation()}
   />
   ```

3. **[ ] Prevent default on mousedown**
   ```jsx
   <input
     onMouseDown={(e) => e.preventDefault()}
     onTouchStart={(e) => e.preventDefault()}
   />
   ```

4. **[ ] Use a hidden input with visible div**
   ```jsx
   <div className="fake-input" onClick={() => inputRef.current.focus()}>
     {value || placeholder}
   </div>
   <input ref={inputRef} style={{position: 'absolute', left: -9999}} />
   ```

### Medium Priority

5. **[ ] Debounce focus events**
   ```jsx
   const handleFocus = useMemo(
     () => debounce((e) => {
       // Handle focus
     }, 100),
     []
   );
   ```

6. **[ ] Use native input without React event handlers**
   ```jsx
   useEffect(() => {
     const input = inputRef.current;
     const handleFocus = (e) => { /* native handler */ };
     input?.addEventListener('focus', handleFocus);
     return () => input?.removeEventListener('focus', handleFocus);
   }, []);
   ```

7. **[ ] Add passive event listeners**
   ```jsx
   <input
     onFocus={(e) => { /* handler */ }}
     onFocusCapture={(e) => { /* handler */ }}
   />
   ```

### Low Priority

8. **[ ] Try contentEditable div instead of input**
   ```jsx
   <div
     contentEditable
     suppressContentEditableWarning
     onInput={(e) => setValue(e.currentTarget.textContent)}
   />
   ```

9. **[ ] Use third-party input library**
   - react-native-web TextInput
   - @ionic/react IonInput
   - Material-UI TextField

10. **[ ] Add Safari-specific polyfill**
    - Check if error only occurs in development
    - Add error suppression for production

## Testing Checklist

- [ ] Test on real iOS device (not just simulator)
- [ ] Test in both development and production builds
- [ ] Test with React DevTools disabled
- [ ] Test in iOS Safari private mode
- [ ] Test on different iOS versions (iOS 14, 15, 16)
- [ ] Check Safari developer console for more detailed errors

## Relevant Links

- [React Issue #10871 - Multiple onFocus events](https://github.com/facebook/react/issues/10871)
- [Safari onClick to focus() not working](https://stackoverflow.com/questions/37587742/safari-onclick-event-to-focus-not-working-in-react)
- [iOS Safari input issues](https://blog.mobiscroll.com/annoying-ios-safari-input-issues-with-workarounds/)

## Notes

- The error message "Script error" is generic and occurs when an error happens in a script loaded from a different origin (CORS)
- iOS Safari has increasingly strict security around keyboard/input activation
- This might be a React 18 specific issue with concurrent features
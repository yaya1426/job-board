# Lecture 127 - Make the Resume Drop Zone Functional | تفعيل منطقة رفع السيرة الذاتية

## Goal

One visible UI win: return to the dashed resume box from the original mockup and make it genuinely clickable, keyboard accessible, and drag-and-drop enabled—without changing the working Server Action upload flow.

## Explain It Simply (For Beginners)

In Lecture 115 we deliberately used a plain file input first. That proved the important backend flow worked:

```txt
choose PDF -> submit form -> server validates -> Spaces stores it
```

Now that the whole pipeline works, we can safely improve the experience. This is **progressive enhancement**: make the simple version correct first, then make it pleasant.

The native `<input type="file">` stays in the form. We only make it visually transparent over the dashed box and add drag-and-drop behavior. The browser still puts the selected `File` into the same `FormData`, so the action and service do not change.

### Jargon decoder

- **Progressive enhancement** = start with a basic working feature, then add a better experience without replacing the reliable foundation.
- **Drag event** = a browser event fired while a file is dragged over or dropped onto an element.
- **`DataTransfer`** = the browser object that carries dragged files. We use it to place a dropped file into the native input.
- **Client validation** = immediate feedback for convenience. The server remains the security authority.

## Files Updated

```txt
components/jobs/JobApplyForm.tsx
```

No action, service, storage, or database file changes in this lecture.

## Step 1 - Add the React Imports

Update the React import:

```tsx
import {
  useActionState,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
```

## Step 2 - Add Small UI Validation Constants

Place these below the `Props` type:

```tsx
const MAX_RESUME_SIZE = 5 * 1024 * 1024;
const PDF_CONTENT_TYPE = "application/pdf";

function validateResumeForUi(file: File): string | null {
  const isPdf =
    file.type === PDF_CONTENT_TYPE ||
    file.name.toLowerCase().endsWith(".pdf");

  if (!isPdf) return "Please choose a PDF file";
  if (file.size > MAX_RESUME_SIZE) return "Resume must be 5MB or smaller";

  return null;
}
```

This duplicates a tiny amount of validation only for instant feedback. `uploadResume` still validates again on the server because browser checks can be bypassed.

## Step 3 - Add State and File Handlers

Inside `JobApplyForm`, after `useActionState`, add:

```tsx
const fileInputRef = useRef<HTMLInputElement>(null);
const [selectedFileName, setSelectedFileName] = useState("");
const [resumeUiError, setResumeUiError] = useState<string | null>(null);
const [isDragging, setIsDragging] = useState(false);

function acceptFile(file: File) {
  const error = validateResumeForUi(file);

  if (error) {
    setResumeUiError(error);
    setSelectedFileName("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    return;
  }

  setResumeUiError(null);
  setSelectedFileName(file.name);
}

function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0];

  if (!file) {
    setSelectedFileName("");
    setResumeUiError(null);
    return;
  }

  acceptFile(file);
}

function handleDrop(event: DragEvent<HTMLDivElement>) {
  event.preventDefault();
  setIsDragging(false);

  const file = event.dataTransfer.files?.[0];
  if (!file || !fileInputRef.current) return;

  const transfer = new DataTransfer();
  transfer.items.add(file);
  fileInputRef.current.files = transfer.files;

  acceptFile(file);
}
```

Why `DataTransfer`? Updating React state alone would only display the filename. Assigning the dropped file to the native input ensures it is included when the form creates `FormData`.

## Step 4 - Replace the Resume Block

Replace the plain file input and the old commented mockup with:

```tsx
<div>
  <label
    htmlFor="resume"
    className="font-heading text-xs font-bold uppercase block mb-2"
  >
    RESUME
  </label>

  <div
    className={`relative brutal-border border-dashed border-3 p-8 text-center transition-none ${
      isDragging ? "bg-accent/20" : "hover:bg-accent/10"
    }`}
    onDragEnter={(event) => {
      event.preventDefault();
      setIsDragging(true);
    }}
    onDragOver={(event) => event.preventDefault()}
    onDragLeave={() => setIsDragging(false)}
    onDrop={handleDrop}
  >
    <input
      ref={fileInputRef}
      id="resume"
      type="file"
      name="resume"
      accept="application/pdf,.pdf"
      required
      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      onChange={handleFileChange}
    />

    <p className="font-mono text-sm font-bold pointer-events-none">
      {isDragging ? "DROP PDF NOW" : "DROP PDF HERE OR CLICK TO BROWSE"}
    </p>
    <p className="font-mono text-xs text-muted-foreground mt-1 pointer-events-none">
      PDF — MAX 5MB
    </p>

    {selectedFileName && (
      <p className="font-mono text-xs font-bold mt-3 pointer-events-none">
        SELECTED: {selectedFileName}
      </p>
    )}
  </div>

  {(resumeUiError || state?.errors?.resume?.[0]) && (
    <p className="font-mono text-xs text-destructive mt-1">
      {resumeUiError ?? state?.errors?.resume?.[0]}
    </p>
  )}
</div>
```

The transparent native input covers the entire box:

- mouse click opens the browser file picker
- keyboard focus/activation still uses a real form control
- a dropped file is assigned to that same input
- normal `FormData` submission remains unchanged

## Step 5 - Remove the Old Mockup Comment

Delete the old commented block:

```tsx
{/* <div className="brutal-border ...">
  ...
</div> */}
```

Keeping dead mockup code after the real UI exists makes the component harder for learners to read.

## Verification

1. Click anywhere in the dashed box: the file picker opens.
2. Pick a valid PDF: its filename appears.
3. Drag a valid PDF onto the box: the highlight changes and the filename appears.
4. Pick/drop a non-PDF: an immediate client message appears.
5. Pick/drop a PDF over 5 MB: an immediate client message appears.
6. Submit a valid dropped PDF: the existing Server Action receives it and the upload still succeeds.
7. Disable/bypass client validation and confirm the server still rejects invalid files.
8. Run:

```bash
npx tsc --noEmit
npm run lint
```

## Key Teaching Lines

> Build the reliable upload first; polish the interaction after the pipeline works.

> The native file input remains the source of truth. Drag-and-drop only improves how the user fills it.

> Client validation improves feedback; server validation protects the system.

## Next

Lecture 128 validates and ships the completed Day 11 workflow through the feature branch.

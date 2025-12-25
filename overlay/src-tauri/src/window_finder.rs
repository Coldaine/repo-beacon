#![cfg(windows)]

use std::ptr;
use tauri::{PhysicalPosition, PhysicalSize};
use windows::{
    core::*,
    Win32::{
        Foundation::*,
        System::Threading::*,
        UI::WindowsAndMessaging::*,
        System::ProcessStatus::*
    },
};

struct WindowInfo {
    hwnd: HWND,
    pid: u32,
}

extern "system" fn enum_windows_proc(hwnd: HWND, lparam: LPARAM) -> BOOL {
    let mut pid = 0;
    unsafe {
        GetWindowThreadProcessId(hwnd, &mut pid);
    }

    let windows = unsafe { &mut *(lparam as *mut Vec<WindowInfo>) };
    windows.push(WindowInfo { hwnd, pid });
    TRUE
}

pub fn find_parent_window_position() -> Option<(PhysicalPosition<i32>, PhysicalSize<u32>)> {
    let parent_pid = unsafe {
        let process = GetCurrentProcess();
        let mut pbi: PROCESS_BASIC_INFORMATION = std::mem::zeroed();
        let mut return_length = 0;
        NtQueryInformationProcess(
            process,
            ProcessBasicInformation,
            &mut pbi as *mut _ as *mut _,
            std::mem::size_of::<PROCESS_BASIC_INFORMATION>() as u32,
            &mut return_length,
        ).ok()?;
        pbi.InheritedFromUniqueProcessId as u32
    };

    let mut windows: Vec<WindowInfo> = Vec::new();
    unsafe {
        EnumWindows(Some(enum_windows_proc), &mut windows as *mut _ as LPARAM);
    }

    for window in windows {
        if window.pid == parent_pid {
            let mut rect = RECT::default();
            if unsafe { GetWindowRect(window.hwnd, &mut rect) }.as_bool() {
                let position = PhysicalPosition::new(rect.left, rect.top);
                let size = PhysicalSize::new((rect.right - rect.left) as u32, (rect.bottom - rect.top) as u32);
                return Some((position, size));
            }
        }
    }

    None
}

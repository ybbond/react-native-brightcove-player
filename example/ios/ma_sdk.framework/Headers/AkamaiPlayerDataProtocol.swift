/*
 * AkamaiPlayerDataProtocol.swift
 * Version - 0.1
 *
 * This file is part of the Media Analytics, http://www.akamai.com
 * Media Analytics is a proprietary Akamai software that you may use and modify per the license agreement here:
 * http://www.akamai.com/product/licenses/mediaanalytics.html
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS “AS IS” AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 *
 *
 * Created by El Visy on 8th May 2017.
 *
 */

import Foundation

// The player data provider protocol
@objc public protocol AkamaiPlayerDataProtocol: class{
  /**
   This call should return the current stream head position of the player in seconds.
   */
  @objc func streamHeadPosition() -> Double

  /**
   Bytes loaded until present time
   */
  @objc func bytesLoaded() -> Int64

  /**
   Number of frames dropped until present time.
   */
  @objc func droppedFrames() -> Int
}

/*
 * AkamaiMediaAnalytics.swift
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

@objc public final class AkamaiMediaAnalytics: NSObject{

  /// Internal implementation of the Media Analytics Library
  fileprivate let mediaAnalyticsImplementation: AkamaiMediaAnalyticsInternal

  // MARK: - Lifecycle Methods
  /**
   Creates an instance of the AkamaiMediaAnalytics

   - Parameter configURL: The configuration/Beacon XML path
   */
  @objc public init (configurationUrl configURL : String){
    mediaAnalyticsImplementation = AkamaiMediaAnalyticsInternal(configurationUrl: configURL)
  }

  deinit{
  }

  /**
   This call starts all metric calculations.

   - Parameter dataProvider: The object implementing AkamaiPlayerDataProtocol interface.
   - Parameter streamUrl: The url of the stream being played
   */
  @objc(handleSessionInit:withStreamUrl:)
  public func handleSessionInit(playerDataProvider dataProvider :AkamaiPlayerDataProtocol, stream streamUrl:String){
    mediaAnalyticsImplementation.handleSessionInit(playerDataProvider:dataProvider, stream: streamUrl)
  }

  /**
   This method triggers calculation of play start metrics. This must be called immediately after the player has
   started to play the video.
   */
  @objc public func handlePlaying(){
    mediaAnalyticsImplementation.handlePlaying()
  }

  /**
   This method must be called when player enters buffering state.
   */
  @objc public func handleBufferStart(){
    mediaAnalyticsImplementation.handleBufferStart()
  }

  /**
   This method must be called when player exits buffering state and starts playing.
   */
  @objc public func handleBufferEnd(){
    mediaAnalyticsImplementation.handleBufferEnd()
  }

  /**
   This method must be called when player is paused.
   */
  @objc public func handlePause(){
    mediaAnalyticsImplementation.handlePause()
  }

  /**
   This method must be called when seek if performed on the video.
   */
  @objc public func handleSeek(){
    mediaAnalyticsImplementation.handleSeek()
  }

  /**
   This method must be called when player encounters an error and stops playing

   - Parameter error: The error which caused the playback to end.
   */
  @objc(handleError:)
  public func handleError(errorReason error :String){
    mediaAnalyticsImplementation.handleError(errorReason: error)
  }

  /**
   This method must be called when play back completed successfully

   - Parameter endReasonCode: The reason for completion of video. (playback completed etc.)
   */
  @objc(handlePlayEnd:)
  public func handlePlayEnd(endReason endReasonCode :String){
    mediaAnalyticsImplementation.handlePlayEnd(endReason: endReasonCode)
  }

  @available(*, deprecated, message: "This API and will be removed soon and is no longer required to be called.")
  /**
   Calls visit on mediaAnalyticsImplementation.
   */
  public func handleVisit(){
  }

  /**
   Handles title switch. All we have to do is set custom dimensions and set
   isFirstTitle = 0
   */
  @objc(handleTitleSwitch:)
  public func handleTitleSwitch(newDimensions customData:[String:String]){
    mediaAnalyticsImplementation.handleTitleSwitch(newDimensions:customData)
  }

  /// Ad apis
  /**
   This call must be made just when the Ad is loaded into the player.
   
   - Parameter adInfo: a dictionary containing ad load related information
   */
  @objc(handleAdLoaded:)
  public func handleAdLoaded(adParam adInfo:[String: String]){
    mediaAnalyticsImplementation.handleAdLoaded(adParam: adInfo)
  }
  
  /**
   This call should be made just when the Ad starts playing.
   
   - Parameter adInfo: a dictionary containing ad start related information
   */
  @objc(handleAdStarted:)
  public func handleAdStarted(adParam adInfo:[String: String]){
    mediaAnalyticsImplementation.handleAdStarted(adParam: adInfo)
  }
  
  /**
   This call should be made when 25% of Ad has played.
   */
  @objc public func handleAdFirstQuartile(){
    mediaAnalyticsImplementation.handleAdFirstQuartile()
  }
  
  /**
   This call should be made when 50% of Ad has played.
   */
  @objc public func handleAdMidPoint(){
    mediaAnalyticsImplementation.handleAdMidPoint()
  }
  
  /**
   This call should be made when 75% of Ad has played.
   */
  @objc public func handleAdThirdQuartile(){
    mediaAnalyticsImplementation.handleAdThirdQuartile()
  }
  
  /**
   This call is made when the ad has completely played.
   */
  @objc public func handleAdComplete(){
    mediaAnalyticsImplementation.handleAdComplete()
  }
  
  
  /**
   This call should be made when the Ad has been stopped/closed/skipped by the user.
   */
  @objc public func handleAdSkipped(){
    mediaAnalyticsImplementation.handleAdSkipped()
  }
  
  /**
   This call should be made when an error occurs while playing the Ad.
   */
  @objc public func handleAdError(){
    mediaAnalyticsImplementation.handleAdError()
  }

  @available(*, deprecated, message: "This API and will be removed soon, MA Library handles Application Foreground on it's own")
  /**
   This call should be made when App is relaunched from background
   */
  public func handleApplicationForeground(){
  }


  /**
   This call should be made when an App goes to background or closed
   */
  @available(*, deprecated, message: "Undocumented API and will soon become unavailable, refer Managing Application Background and Foreground section of the integration guide")
  public func handleAdAppClosedBackground(){
  }

  /**
   The method to be called when the application quits.
   */
  @objc public func handleApplicationExit(){
    mediaAnalyticsImplementation.handleApplicationExit()
  }

  /**
   This method must be called either when bit rate of the video changes or bit rate information becomes available.

   - Parameter newBitRate: The bit rate currently served (Bit rate in bits per second).
   */
  @objc(handleBitrateChange:)
  public func handleBitrateChange(bitRate newBitRate: Int64){
    mediaAnalyticsImplementation.handleBitrateChange(bitRate: newBitRate)
  }

  /**
   This method can be called to set custom data on the plugin. Ideally should be called before handleSessionInit

   - Parameter keyInfo: Dimension name to be set
   - Parameter data: Value to be reported for the dimension.
   */
  @objc(setData:value:)
  public func setData(key keyInfo:String, forValue data:String){
    mediaAnalyticsImplementation.setData(key: keyInfo, forValue: data)
  }

  /**
  This method can be called to set stream length
  - Parameter duration: length of the stream in seconds
  */
  @objc(setStreamDuration:)
  public func setStreamDuration(duration:Int64){
    mediaAnalyticsImplementation.setStreamLength(duration: duration)
  }

  /**
   This method can be called for setting veiwerId.

   - Parameter viewerId: The viewerId to be set.
   */
  @objc(setViewerId:)
  public func setViewerId(uniqueViewerId viewerId:String){
    mediaAnalyticsImplementation.setViewerId(uniqueViewerId: viewerId)
  }

  /**
   This method can be called for setting veiwer diagnostic Id.

   - Parameter diagnosticId: The viewer diagnostic Id to be set.
   */
  @objc(setViewerDiagnosticId:)
  public func setViewerDiagnosticId(uniqueDiagnosticId diagnosticId:String){
    mediaAnalyticsImplementation.setViewerDiagnosticId(uniqueDiagnosticId: diagnosticId)
  }

  @available(*, deprecated, message: "This API and will be removed soon, use setData() instead")
  /**
  Set the delivery type of the currently playing stream
  - Parameter deliveryType: Delivery type of the content. Eg. VOD, Live, etc
  */
  public func setDeliveryType(type:String){
    mediaAnalyticsImplementation.setData(key: "deliveryType", forValue: type)
  }

  /**
   Method to turn on reporting of server ip address. This is currently supported only for akamai hosted stream
   */
  @objc public func enableServerIpLookup(){
    mediaAnalyticsImplementation.enableServerIpLookup()
  }

  /**
   Method to turn off reporting of server ip address. This is currently supported only for akamai hosted stream
   */
  @objc public func disableServerIpLookup(){
    mediaAnalyticsImplementation.disableServerIpLookup()
  }

  /**
   Method to turn off reporting of location.
   */
  @objc public func enableLocation(){
    mediaAnalyticsImplementation.enableLocation()
  }

  /**
   Method to turn off reporting of location.
   */
  @objc public func disableLocation(){
    mediaAnalyticsImplementation.disableLocation()
  }

  /**
   Method to turn on/off beacon reporting

   - Parameter enable: True to turn on the logging, false to turn it off.
   */
  @objc(setDebugLogging:)
  public func setDebugLogging(enableDebug enable:Bool){
    mediaAnalyticsImplementation.setDebugLogging(enableDebug: enable)
  }

  /**
   Method to append the loader information to the sdk information.
   - Parameter loaderInformation: Contains the name and version of the loader in a specific format.
   */
  internal func setLoaderInformation(loaderInformation:String) {
    mediaAnalyticsImplementation.setLoaderInformation(loaderInformation: loaderInformation)
  }
}
